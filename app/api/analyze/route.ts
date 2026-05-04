import { NextRequest, NextResponse } from 'next/server';

import { aiOrchestrator } from '@/services/ai/orchestrator';
import { checkIpLimit, incrementIpCount } from '@/services/security/rate-limiter';
import { auth } from '@/auth';
import { getUserPlan } from '@/lib/users-db';
import type { Priority } from '@/types';

const USAGE_LIMIT = 3;
const COOKIE_NAME = 'decido_usage';

function enforceImperative(text: string): string {
  return text
    .replace(/^(falar)\b/i, 'Fale')
    .replace(/^(esperar)\b/i, 'Espere')
    .replace(/^(revisar)\b/i, 'Revise')
    .replace(/^(enviar)\b/i, 'Envie')
    .replace(/^(ligar)\b/i, 'Ligue')
    .replace(/^(ir)\b/i, 'Vá')
    .replace(/^(voltar)\b/i, 'Volte')
    .replace(/^(responder)\b/i, 'Responda')
    .replace(/^(tentar)\b/i, '')
    .trim()
}

function makeMoreDecisive(text: string): string {
  return enforceImperative(
    text
      .replace(/\b(você pode|talvez|considere|poderia|tente)\b/gi, '')
      .replace(/\b(um pouco|pode ser|acho que|provavelmente)\b/gi, '')
      .replace(/\b(mais tarde|depois|em breve|logo)\b/gi, 'hoje')
      .replace(/^(uma boa ideia seria|vale a pena)\s+/i, '')
      .replace(/^(é melhor|seria bom)\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

function ensureCapitalization(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const IMPERATIVE_IRREGULARS: Record<string, string> = {
  'ir': 'Vá', 'fazer': 'Faça', 'dizer': 'Diga', 'ver': 'Veja',
  'vir': 'Venha', 'ter': 'Tenha', 'ser': 'Seja', 'estar': 'Esteja',
  'dar': 'Dê', 'trazer': 'Traga', 'saber': 'Saiba', 'querer': 'Queira',
  'falar': 'Fale', 'esperar': 'Espere', 'ligar': 'Ligue', 'pagar': 'Pague',
  'chegar': 'Chegue', 'colocar': 'Coloque', 'ficar': 'Fique',
  'entregar': 'Entregue', 'começar': 'Comece', 'brincar': 'Brinque',
}

function humanizeTask(task: string): string {
  if (!task) return task
  const words = task.trim().split(/\s+/)
  const verb = words[0].toLowerCase()
  const rest = words.slice(1).join(' ')

  let imperative: string
  if (IMPERATIVE_IRREGULARS[verb]) {
    imperative = IMPERATIVE_IRREGULARS[verb]
  } else if (verb.endsWith('ar')) {
    const stem = verb.slice(0, -2)
    imperative = stem.charAt(0).toUpperCase() + stem.slice(1) + 'e'
  } else if (verb.endsWith('er') || verb.endsWith('ir')) {
    const stem = verb.slice(0, -2)
    imperative = stem.charAt(0).toUpperCase() + stem.slice(1) + 'a'
  } else {
    imperative = verb.charAt(0).toUpperCase() + verb.slice(1)
  }

  const hasTimeRef = /agora|hoje|amanhã|logo|imediatamente/i.test(task)
  const suffix = hasTimeRef ? '.' : ' agora.'
  return rest ? `${imperative} ${rest}${suffix}` : `${imperative}${suffix}`
}

function enforceDistributionRules(priorities: Priority[]): Priority[] {
  const all = priorities
  const count = all.length

  const assign = (item: Priority, level: Priority['level']) => ({ ...item, level })

  if (count === 1) return [assign(all[0], 'alta')]
  if (count === 2) return [assign(all[0], 'alta'), assign(all[1], 'média')]
  if (count === 3) return [assign(all[0], 'alta'), assign(all[1], 'média'), assign(all[2], 'baixa')]
  if (count === 4) return [assign(all[0], 'alta'), assign(all[1], 'média'), assign(all[2], 'baixa'), assign(all[3], 'baixa')]
  return [
    assign(all[0], 'alta'),
    assign(all[1], 'média'),
    assign(all[2], 'média'),
    ...all.slice(3).map(p => assign(p, 'baixa')),
  ]
}

function enforceDecisionConsistency(primaryAction: string, priorities: Priority[]): string {
  const topPriority = priorities.find(p => p.level === 'alta')
  if (!topPriority) return primaryAction

  const topTask = topPriority.task
  const isAligned =
    primaryAction &&
    primaryAction.toLowerCase().includes(topTask.toLowerCase().split(' ').slice(0, 3).join(' '))

  return isAligned ? primaryAction : humanizeTask(topTask)
}

function enforceSingleHighPriority(priorities: Priority[]): Priority[] {
  const high = priorities.filter(p => p.level === 'alta')
  if (high.length <= 1) return priorities

  const [primary, ...demoted] = high
  const rest = priorities.filter(p => p.level !== 'alta')
  return [
    primary,
    ...demoted.map(p => ({ ...p, level: 'média' as const })),
    ...rest,
  ]
}

function formatDecisionOutput(text: string, plan: 'free' | 'pro'): string {
  if (plan === 'pro') return makeMoreDecisive(text)
  return text
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const isPro = userEmail ? getUserPlan(userEmail) === 'pro' : false;

    const { input, history } = await req.json();
    const isProd = process.env.NODE_ENV === 'production';

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json(
        { error: 'Input is required and must be a string.' },
        { status: 400 }
      );
    }

    // 1. Verificação por Cookie (Soft Limit - Todos os ambientes)
    const today = getTodayDate();
    const raw = req.cookies.get(COOKIE_NAME)?.value;
    let usage = { count: 0, date: today };

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        usage = parsed.date === today
          ? { count: parsed.count, date: today }
          : { count: 0, date: today };
      } catch {
        usage = { count: 0, date: today };
      }
    }

    if (!isPro && usage.count >= USAGE_LIMIT) {
      return NextResponse.json(
        { error: 'Limite diário de análises atingido. Tente novamente amanhã.' },
        { status: 429 }
      );
    }

    // 2. Verificação por IP (Hard Limit - Apenas Produção)
    const ip = getClientIp(req);
    if (!isPro && isProd) {
      const { allowed } = checkIpLimit(ip);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Limite de segurança por dispositivo atingido. Tente novamente amanhã.' },
          { status: 429 }
        );
      }
    }

    // Processar análise
    const plan = isPro ? 'pro' : 'free';
    const result = await aiOrchestrator(input, history, plan);
    result.priorities = enforceDistributionRules(enforceSingleHighPriority(result.priorities));
    result.primary_action = ensureCapitalization(
      formatDecisionOutput(
        enforceDecisionConsistency(result.primary_action, result.priorities),
        plan
      )
    );

    // Atualizar contadores (apenas para não-PRO)
    const response = NextResponse.json(result);
    if (!isPro) {
      usage.count += 1;
      if (isProd) incrementIpCount(ip);
      response.cookies.set(COOKIE_NAME, JSON.stringify(usage), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } catch (error: unknown) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Não foi possível processar a análise no momento.' },
      { status: 500 }
    );
  }
}
