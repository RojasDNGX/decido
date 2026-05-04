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

function humanizeTask(task: string): string {
  if (!task) return ''

  const clean = task.trim().toLowerCase()
  const [verb, ...rest] = clean.split(' ')
  const restText = rest.join(' ')

  const irregulars: Record<string, string> = {
    ir: 'Vá', fazer: 'Faça', dizer: 'Diga', trazer: 'Traga',
    sair: 'Saia', pôr: 'Coloque', ver: 'Veja', dar: 'Dê',
    vir: 'Venha', ter: 'Tenha', ser: 'Seja', estar: 'Esteja',
    saber: 'Saiba', pedir: 'Peça', ouvir: 'Ouça', seguir: 'Siga',
    conseguir: 'Consiga', medir: 'Meça',
  }

  let imperative = ''

  if (irregulars[verb]) {
    imperative = irregulars[verb]
  } else if (verb.endsWith('ar')) {
    imperative = verb.slice(0, -2) + 'e'
  } else if (verb.endsWith('er') || verb.endsWith('ir')) {
    imperative = verb.slice(0, -2) + 'a'
  } else {
    return `Comece por isso agora: ${task}.`
  }

  let result = `${imperative}${restText ? ' ' + restText : ''}`

  if (!/(agora|hoje|já|imediatamente)/i.test(result)) {
    result += ' agora'
  }

  result = result.charAt(0).toUpperCase() + result.slice(1)

  return result.endsWith('.') ? result : result + '.'
}

function varyAction(text: string): string {
  if (!text) return text

  const variants = [
    (t: string) => t,
    (t: string) => t.replace(' agora.', ' imediatamente.'),
    (t: string) => t.replace(' agora.', ' ainda agora.'),
    (t: string) => t.replace(' agora.', ' sem adiar.'),
    (t: string) => t.replace(/^/, 'Comece: '),
    (t: string) => t.replace(/^/, 'Priorize isso: '),
  ]

  const index = text.length % variants.length
  return variants[index](text)
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

function enforceCoverage(input: string, priorities: Priority[]): Priority[] {
  const inputTasks = input
    .split(/,|;| e também | e /i)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 3)

  const outputTasks = priorities.map(p => p.task.toLowerCase())

  const missing = inputTasks.filter(
    task => !outputTasks.some(out => out.includes(task) || task.includes(out.split(' ').slice(0, 2).join(' ')))
  )

  if (missing.length === 0) return priorities

  return [
    ...priorities,
    ...missing.map(task => ({ task, level: 'baixa' as const, reason: '' })),
  ]
}

function enforceDecisionConsistency(primaryAction: string, priorities: Priority[]): string {
  const topPriority = priorities.find(p => p.level === 'alta')
  if (!topPriority) return primaryAction

  const topTask = topPriority.task
  const isAligned =
    primaryAction &&
    primaryAction.toLowerCase().includes(topTask.toLowerCase().split(' ').slice(0, 3).join(' '))

  return isAligned ? primaryAction : varyAction(humanizeTask(topTask))
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
    result.priorities = enforceDistributionRules(enforceSingleHighPriority(enforceCoverage(input, result.priorities)));
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
