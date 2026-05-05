import { NextRequest, NextResponse } from 'next/server';

import { aiOrchestrator } from '@/services/ai/orchestrator';
import { checkIpLimit, incrementIpCount } from '@/services/security/rate-limiter';
import { auth } from '@/auth';
import { getUserPlan } from '@/lib/users-db';
import { sanitizeTasks, recoverCoverage } from '@/services/ai/sanitize';
import { isOverloadInput } from '@/services/ai/overload';
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
    pagar: 'Pague', chegar: 'Chegue', jogar: 'Jogue', ligar: 'Ligue',
    ficar: 'Fique', entregar: 'Entregue', negar: 'Negue',
  }

  let imperative = ''

  if (irregulars[verb]) {
    imperative = irregulars[verb]
  } else if (verb.endsWith('ar')) {
    imperative = verb.slice(0, -2) + 'e'
  } else if (verb.endsWith('er') || verb.endsWith('ir')) {
    imperative = verb.slice(0, -2) + 'a'
  } else {
    const capitalized = task.charAt(0).toUpperCase() + task.slice(1).trim()
    return (capitalized.endsWith('.') ? capitalized : capitalized + ' agora.')
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
  // PRIMARY ACTION always ends with "agora" — no variation allowed
  return text
}

function normalizeTitle(task: string): string {
  if (!task) return task
  const clean = stripFillers(task).trim()
  return ensureCapitalization(clean)
}

function stripFillers(text: string): string {
  return text
    .replace(/\b(preciso|tenho que|tenho de|ainda|devo|vou|quero)\b/gi, '')
    .replace(/\b(tenho \d+ (minutos?|horas?|segundos?))\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeForMatch(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ�]/g, '').toLowerCase()
}

function sharedKeywords(a: string, b: string): number {
  const stopWords = new Set(['um', 'uma', 'o', 'a', 'de', 'do', 'da', 'no', 'na', 'para', 'pro', 'com', 'por', 'ao', 'ha', 'dias', 'dia'])
  const normA = normalizeForMatch(a)
  const normB = normalizeForMatch(b)
  const wordsA = new Set(normA.split(' ').filter(w => w.length > 2 && !stopWords.has(w)))
  return normB.split(' ').filter(w => w.length > 2 && !stopWords.has(w) && wordsA.has(w)).length
}

function deduplicatePriorities(priorities: Priority[]): Priority[] {
  const result: Priority[] = []
  for (const p of priorities) {
    const norm = normalizeForMatch(stripFillers(p.task))
    const isDuplicate = result.some(existing => {
      const existingNorm = normalizeForMatch(stripFillers(existing.task))
      return existingNorm.includes(norm) || norm.includes(existingNorm) || sharedKeywords(norm, existingNorm) >= 2
    })
    if (!isDuplicate) result.push(p)
  }
  return result
}

const IMPACT_LEVEL_3 = ['remédio', 'medicamento', 'medicina', 'saúde', 'médico', 'hospital', 'dor', 'febre', 'injeção', 'comprimido', 'dose', 'tratamento', 'vacina', 'cirurgia', 'emergência']
const IMPACT_LEVEL_2 = ['fatura', 'conta', 'pagamento', 'vence', 'boleto', 'débito', 'cobrança', 'multa', 'cliente', 'prazo', 'entrega', 'reunião', 'atrasado', 'projeto']

function getImpactLevel(task: string): 3 | 2 | 1 {
  const norm = normalizeForMatch(task)
  const matchWord = (k: string) => new RegExp(`\\b${normalizeForMatch(k)}\\b`).test(norm)
  if (IMPACT_LEVEL_3.some(matchWord)) return 3
  if (IMPACT_LEVEL_2.some(matchWord)) return 2
  return 1
}

function extractTasksFromVerbs(input: string): string[] {
  const stripped = stripFillers(input.toLowerCase())
  const words = stripped.split(/\s+/).filter(Boolean)
  const verbIndices: number[] = []

  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    if (w.length > 3 && (w.endsWith('ar') || w.endsWith('er') || w.endsWith('ir'))) {
      verbIndices.push(i)
    }
  }

  if (verbIndices.length === 0) return []

  return verbIndices.map((verbIdx, i) => {
    const nextVerb = verbIndices[i + 1] ?? words.length
    const end = Math.min(nextVerb, verbIdx + 5)
    return words.slice(verbIdx, end).join(' ').replace(/\be\b$/, '').trim()
  }).filter(t => t.length > 3)
}

function splitMergedTasks(priorities: Priority[]): Priority[] {
  return priorities.flatMap(p => {
    const verbsInTitle = extractTasksFromVerbs(p.task)
    if (verbsInTitle.length <= 1) return [p]
    return verbsInTitle.map((t, i) => ({
      task: ensureCapitalization(t),
      level: (i === 0 ? p.level : 'média') as Priority['level'],
      reason: i === 0 ? p.reason : '',
    }))
  })
}

const WEAK_REASON_PATTERNS = [
  /não há prazo/i, /não possui prazo/i, /sem prazo imediato/i,
  /nenhum prazo/i, /não há urgência/i, /não há consequência/i,
  /não há impacto/i, /não mencionado/i, /mencionada para/i,
  /não possui urgência/i, /não possui consequência/i,
  /nível \d/i, /é uma tarefa de/i, /é um nível/i,
  /pode ser feito depois/i, /pode ser realizado depois/i,
  // Patch 4: anti-abstraction
  /é importante/i, /fator crítico/i, /exige atenção/i, /deve ser feito/i,
  /\bimpacto\b/i, /pode afetar/i, /pode causar problema/i,
  /não há menção/i, /condição para/i, /necessário para/i,
  /\bcategoria\b/i, /baseado em/i, /sugere que/i, /insatisfa/i, /especificad/i,
]

function enforceReasonQuality(priorities: Priority[]): Priority[] {
  const fallbacks: Record<Priority['level'], string> = {
    alta: 'Pode causar efeito imediato se atrasar.',
    média: 'Pode atrasar o que vem depois.',
    baixa: 'Não afeta agora.',
  }
  return priorities.map(p => {
    const reason = p.reason?.trim() ?? ''
    const wordCount = reason.split(/\s+/).length
    const isWeak = wordCount < 4 || WEAK_REASON_PATTERNS.some(r => r.test(reason))
    if (isWeak) return { ...p, reason: fallbacks[p.level] }
    return p
  })
}

function reorderByImpact(priorities: Priority[]): Priority[] {
  const level3 = priorities.filter(p => getImpactLevel(p.task) === 3)
  const level2 = priorities.filter(p => getImpactLevel(p.task) === 2)
  const level1 = priorities.filter(p => getImpactLevel(p.task) === 1)
  if (level3.length === 0 && level2.length === 0) return priorities
  return [...level3, ...level2, ...level1]
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
  const splitSegments = input
    .split(/,|;|\be também\b/i)
    .flatMap(s => s.split(/\be\b/i))
    .map(s => stripFillers(s.trim()))
    .filter(s => s.length > 3)
    .filter(s => !/^\d+\s+(minutos?|horas?|segundos?)$/.test(s))

  const verbSegments = extractTasksFromVerbs(input)

  const allSegments = [...new Set([...splitSegments, ...verbSegments])]
    .filter(s => !s.includes('�'))

  const outputNorms = priorities.map(p => normalizeForMatch(stripFillers(p.task)))

  const missing = allSegments.filter(seg => {
    const segNorm = normalizeForMatch(seg)
    return !outputNorms.some(out =>
      out.includes(segNorm) ||
      segNorm.includes(out) ||
      sharedKeywords(segNorm, out) >= 2
    )
  })

  if (missing.length === 0) return priorities

  return [
    ...priorities,
    ...missing.map(task => ({
      task: ensureCapitalization(task),
      level: 'baixa' as const,
      reason: 'Pode ser resolvido após as prioridades imediatas.',
    })),
  ]
}

function enforceDecisionConsistency(_primaryAction: string, priorities: Priority[]): string {
  const topPriority = priorities.find(p => p.level === 'alta')
  if (!topPriority) return _primaryAction
  // FREE: rebuild from task title to guarantee imperative form and "agora"
  return humanizeTask(topPriority.task)
}

// PRO/ENTERPRISE: preserve AI-generated primary_action richness.
// Only enforces "agora." termination without rebuilding from task title.
function enforceProAction(primaryAction: string, priorities: Priority[]): string {
  const topPriority = priorities.find(p => p.level === 'alta')
  if (!topPriority) return primaryAction

  let action = primaryAction.trim()
  // Ensure the action ends with "agora."
  if (!/(agora)/i.test(action)) {
    action = action.replace(/[.!?]+$/, '') + ' agora.'
  } else if (!action.endsWith('.')) {
    action = action.replace(/[.!?]+$/, '') + '.'
  }
  return action
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
    const userPlan = userEmail ? getUserPlan(userEmail) : 'free';
    const isPro = userPlan !== 'free'; // covers pro + enterprise

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
    const plan = userPlan;
    const result = await aiOrchestrator(input, history, plan);

    if (isOverloadInput(input)) {
      // OVERLOAD MODE: bypass complex pipeline for all plans
      // result already contains the built overload response from orchestrator
      result.priorities = result.priorities.map(p => ({ ...p, task: normalizeTitle(p.task) }));
    } else if (plan === 'free') {
      // FREE: simplified pipeline
      // PRO / ENTERPRISE: full pipeline + preserve AI primary_action richness
      const preSanitized = enforceCoverage(input, reorderByImpact(splitMergedTasks(deduplicatePriorities(result.priorities))));
      
      // Apply deterministic sanitization
      const sanitized = sanitizeTasks(preSanitized);
      
      // Recover coverage if too many tasks were removed
      const recovered = recoverCoverage(input, sanitized);
      
      const pipeline = deduplicatePriorities(recovered);

      result.priorities = enforceReasonQuality(enforceDistributionRules(enforceSingleHighPriority(pipeline)))
        .map(p => ({ ...p, task: normalizeTitle(p.task) }));

      // Guarantee High Priority: if all high tasks were filtered, rebuild from primary_action
      if (!result.priorities.some(p => p.level === 'alta') && result.primary_action) {
        const fallback: Priority = {
          task: normalizeTitle(result.primary_action.replace(/\s+agora\.?$/i, '').replace(/[.!?]+$/, '')),
          level: 'alta',
          reason: 'Ação crítica identificada como prioridade imediata.'
        };
        result.priorities = [fallback, ...result.priorities];
      }

      // Do NOT rebuild via humanizeTask — keep contextual richness from AI output
      result.primary_action = ensureCapitalization(
        makeMoreDecisive(enforceProAction(result.primary_action, result.priorities))
      );
    }

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
