import { NextRequest, NextResponse } from 'next/server';

import { aiOrchestrator } from '@/services/ai/orchestrator';
import { checkIpLimit, incrementIpCount } from '@/services/security/rate-limiter';
import { auth } from '@/auth';
import { getUserPlan } from '@/lib/users-db';
import { getDailyUsage, incrementDailyUsage } from '@/lib/usage-db';
import { sanitizeTasks, recoverCoverage } from '@/services/ai/sanitize';
import { isOverloadInput } from '@/services/ai/overload';
import type { Priority } from '@/types';

import { getPlanLimits } from '@/lib/plans';

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

function buildLimitResponse() {
  return {
    type: "limit_reached",
    message: {
      title: "Sua clareza diária está pausada.",
      description: `
Você chegou ao limite de análises gratuitas.

No PRO, o Decido já sabe — e te diz o que fazer sem repetir o esforço.
      `,
      cta: "Continuar agora com PRO"
    }
  };
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

const IMPACT_LEVEL_3 = [
  'remédio', 'medicamento', 'medicina', 'saúde', 'médico', 'médica', 'hospital', 
  'dor', 'febre', 'injeção', 'comprimido', 'dose', 'tratamento', 'vacina', 
  'cirurgia', 'emergência', 'consulta', 'exame', 'agendar', 'dentista', 'psicólogo', 
  'terapia', 'sintoma', 'lesão', 'segurança', 'escola', 'veterinário', 'morrer', 'socorro'
]
const IMPACT_LEVEL_2 = ['fatura', 'conta', 'pagamento', 'vence', 'boleto', 'débito', 'cobrança', 'multa', 'cliente', 'prazo', 'entrega', 'reunião', 'atrasado', 'projeto', 'relatório', 'apresentação', 'trabalho', 'faculdade', 'prova', 'estudar']

const DEPENDENT_KEYWORDS = ['filho', 'filha', 'criança', 'pet', 'cachorro', 'gato', 'idoso', 'bebê']
const SAFETY_CONTEXT = ['médico', 'escola', 'veterinário', 'dor', 'febre', 'segurança', 'sozinho', 'emergência', 'estranho', 'doente']

function getImpactLevel(task: string): 3 | 2 | 1 {
  const norm = normalizeForMatch(task)
  const matchWord = (k: string) => new RegExp(`\\b${normalizeForMatch(k)}\\b`).test(norm)
  
  // 1. HEALTH & EXPLICIT SAFETY (Highest Priority)
  if (IMPACT_LEVEL_3.some(matchWord)) {
    const minimized = ['rotina', 'check-up', 'não urgente', 'não é urgente', 'pode esperar', 'depois'].some(k => norm.includes(k))
    if (minimized) return 1
    return 3
  }
  
  // 2. DEPENDENT SAFETY SPLIT
  const isDependent = DEPENDENT_KEYWORDS.some(matchWord)
  const hasSafetyContext = SAFETY_CONTEXT.some(matchWord)
  if (isDependent && hasSafetyContext) {
    return 3
  }
  
  // 3. FINANCIAL/LEGAL/PROFESSIONAL
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

// RENDER ENGINE: Justification quality is now handled by the AI via render.md layer.
// Template-based enforceReasonQuality() has been removed.
// The AI generates signal-driven, contextual justifications per task.

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

  if (count === 0) return []
  if (count === 1) return [assign(all[0], 'alta')]
  if (count === 2) {
    // Escolher o de maior impacto léxico para Alta
    const i0 = getImpactLevel(all[0].task)
    const i1 = getImpactLevel(all[1].task)
    if (i1 > i0) return [assign(all[0], 'média'), assign(all[1], 'alta')]
    return [assign(all[0], 'alta'), assign(all[1], 'média')]
  }
  
  // Para 3 ou mais: Forçar 1 Alta, 1 Média, 1 Baixa no topo
  const result = [...all]
  result[0] = assign(result[0], 'alta')
  result[1] = assign(result[1], 'média')
  result[2] = assign(result[2], 'baixa')
  
  // Distribuir o resto
  for (let i = 3; i < count; i++) {
    result[i] = assign(result[i], 'baixa')
  }
  
  return result
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
    const limits = getPlanLimits(userPlan);
    const isPro = userPlan !== 'free'; // covers pro + enterprise

    console.log(`[Plan Enforcement] User: ${userEmail ?? 'anonymous'} | Plan: ${userPlan} | isPro: ${isPro}`);

    const { input, history, fingerprint } = await req.json();
    const isProd = process.env.NODE_ENV === 'production';
    
    // --- 8. DEV / TEST MODE ---
    const DEV_USERS = ["thiago.rojas@dngx.com.br"];
    let skipLimit = process.env.DISABLE_LIMIT === "true" || req.headers.get("x-dev-mode") === "true";
    if (userEmail && DEV_USERS.includes(userEmail)) skipLimit = true;

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json(
        { error: 'Input is required and must be a string.' },
        { status: 400 }
      );
    }

    // --- 3. SERVER IDENTIFIER RESOLUTION ---
    const ip = getClientIp(req);
    const identifier = userEmail || fingerprint || ip;
    const today = getTodayDate();

    // --- 7. ANTI-BYPASS: MULTI-FINGERPRINT DETECTION ---
    // Simples detecção em memória: se um IP usar mais de 3 fingerprints diferentes hoje
    if (!isPro && !skipLimit && fingerprint && ip) {
      const ipFpKey = `fp_track:${ip}:${today}`;
      // Nota: Idealmente isso estaria no DB, mas para o MVP usaremos o rate-limiter logic ou similar
      // Para este patch, focaremos na resolução robusta do identificador principal
    }

    // 1. Verificação de Limite (DB-side)
    const count = getDailyUsage(identifier, today);

    if (!isPro && !skipLimit && count >= limits.dailyAnalyses) {
      return NextResponse.json(buildLimitResponse(), { status: 429 });
    }

    // Processar análise
    const plan = userPlan;
    const result = await aiOrchestrator(input, history, plan);

    // DEFENSIVE: Normalize AI output to expected contract
    // The model may return alternative structures or malformed properties
    if (!Array.isArray(result.priorities)) {
      console.warn('[Pipeline] priorities is not an array, received:', typeof result.priorities);
      const altTasks = (result as unknown as Record<string, unknown>).ordered_tasks ?? (result as unknown as Record<string, unknown>).tasks;
      if (Array.isArray(altTasks)) {
        result.priorities = (altTasks as Array<Record<string, any>>).map((t, i) => ({
          task: t.label ?? t.name ?? t.task ?? String(t),
          level: (i === 0 ? 'alta' : i === 1 ? 'média' : 'baixa') as Priority['level'],
          reason: t.reason ?? '',
        }));
      } else {
        result.priorities = [];
      }
    }

    // Clean up malformed entries in priorities
    result.priorities = result.priorities.filter(p => p && typeof p === 'object' && p.task);

    if (!result.primary_action || typeof result.primary_action !== 'string') {
      console.warn('[Pipeline] primary_action is missing or malformed, attempting recovery');
      const alt = (result as unknown as Record<string, unknown>);
      result.primary_action = (alt.recommended_action as string)
        ?? (result.priorities[0]?.task ? humanizeTask(result.priorities[0].task) : '')
        ?? '';
    }

    if (isOverloadInput(input)) {
      result.priorities = result.priorities.map(p => ({ ...p, task: normalizeTitle(p.task) }));
    } else {
      // --- SHARED DECISION PIPELINE (CORE + HEURISTICS) ---
      const preSanitized = enforceCoverage(input, reorderByImpact(splitMergedTasks(deduplicatePriorities(result.priorities))));
      const sanitized = sanitizeTasks(preSanitized);
      const recovered = recoverCoverage(input, sanitized);
      const pipeline = deduplicatePriorities(recovered);

      result.priorities = enforceDistributionRules(enforceSingleHighPriority(pipeline))
        .map(p => ({ ...p, task: normalizeTitle(p.task) }));

      if (!result.priorities.some(p => p.level === 'alta') && result.primary_action) {
        const fallback: Priority = {
          task: normalizeTitle(result.primary_action.replace(/\s+agora\.?$/i, '').replace(/[.!?]+$/, '')),
          level: 'alta',
          reason: 'Prioridade imediata identificada pelo motor de decisão.'
        };
        result.priorities = [fallback, ...result.priorities];
      }

      result.primary_action = ensureCapitalization(
        makeMoreDecisive(enforceProAction(result.primary_action, result.priorities))
      );
    }

    // FINAL HARDENING & DEDUPLICATION (Global)
    const uniqueTasks = new Set<string>();
    result.priorities = result.priorities.filter(p => {
      const norm = normalizeTitle(p.task);
      if (uniqueTasks.has(norm)) return false;
      uniqueTasks.add(norm);
      return true;
    });

    // Ensure at least one priority exists
    if (result.priorities.length === 0 && result.primary_action) {
      result.priorities = [{ task: normalizeTitle(result.primary_action), level: 'alta', reason: 'Ação prioritária identificada.' }];
    }

    // Atualizar contadores (apenas para não-PRO)
    if (!isPro && !skipLimit) {
      incrementDailyUsage(identifier, today);
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Não foi possível processar a análise no momento.' },
      { status: 500 }
    );
  }
}
