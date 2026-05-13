import { NextRequest, NextResponse } from 'next/server';

import { aiOrchestrator } from '@/services/ai/orchestrator';
import { checkIpLimit, incrementIpCount } from '@/services/security/rate-limiter';
import { auth } from '@/auth';
import { getUserPlan, hasUsedProTasting, markProTastingUsed } from '@/lib/users-db';
import { saveUserDecision, getUserDecisions } from '@/lib/history-db';
import crypto from 'crypto';
import { getDailyUsage, incrementDailyUsage } from '@/lib/usage-db';
import { sanitizeTasks, recoverCoverage } from '@/services/ai/sanitize';
import { isOverloadInput } from '@/services/ai/overload';
import type { Priority } from '@/types';

import { getPlanLimits } from '@/lib/plans';
import { logger } from '@/lib/logger';
import { analytics } from '@/lib/analytics';
import { getUserByEmail as getUserFullRecord } from '@/lib/users-db';
import { buildLayeredPrompt } from '@/services/ai/prompts/builder';

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
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
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

function enforceCoverage(input: string, priorities: Priority[]): Priority[] {
  const splitSegments = input
    .split(/,|;|\be também\b/i)
    .flatMap(s => s.split(/\be\b/i))
    .map(s => stripFillers(s.trim()))
    .filter(s => s.length > 3)
    .filter(s => !/^\d+\s+(minutos?|horas?|segundos?)$/.test(s))

  const verbSegments = extractTasksFromVerbs(input)

  const allSegments = [...new Set([...splitSegments, ...verbSegments])]
    .filter(s => !s.includes(''))

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

function enforceProAction(primaryAction: string, priorities: Priority[]): string {
  const topPriority = priorities.find(p => p.level === 'alta')
  if (!topPriority) return primaryAction

  let action = primaryAction.trim()
  if (!/(agora)/i.test(action)) {
    action = action.replace(/[.!?]+$/, '') + ' agora.'
  } else if (!action.endsWith('.')) {
    action = action.replace(/[.!?]+$/, '') + '.'
  }
  return action
}

function enforcePrimaryFromHigh(primaryAction: string, priorities: Priority[]): string {
  const highTask = priorities.find(p => p.level === 'alta')
  if (!highTask) return primaryAction

  const primaryNorm = normalizeForMatch(primaryAction.replace(/\s+agora\.?$/i, '').replace(/[.!?]+$/, ''))
  const highNorm = normalizeForMatch(stripFillers(highTask.task))
  
  if (sharedKeywords(primaryNorm, highNorm) >= 2 || primaryNorm.includes(highNorm) || highNorm.includes(primaryNorm)) {
    return primaryAction
  }

  console.warn('[Governance] PRIMARY diverged from HIGH bucket. Forcing derivation.', {
    aiPrimary: primaryAction,
    highTask: highTask.task
  })
  return humanizeTask(highTask.task)
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

function buildLimitResponse(isAuthenticated: boolean) {
  return {
    type: "limit_reached",
    message: {
      title: isAuthenticated ? "Suas análises de hoje acabaram." : "Limite de convidado atingido.",
      description: isAuthenticated 
        ? "Desbloqueie análises ilimitadas com o PRO — ou aguarde 24h para utilizar suas 3 análises diárias gratuitas."
        : "Cadastre-se para continuar decidindo com clareza — ou aguarde 24h para novas análises.",
      cta: isAuthenticated ? "Continuar com PRO" : "Criar conta gratuita",
      link: isAuthenticated ? "/limite" : "/auth/signup", 
      secondary_cta: isAuthenticated ? null : "Entrar com Google",
      secondary_link: isAuthenticated ? null : "/auth/signin"
    }
  };
}

export async function POST(req: NextRequest) {
  const today = getTodayDate();
  let userEmail: string | undefined;

  try {
    const session = await auth();
    userEmail = session?.user?.email;
    const userPlan = userEmail ? getUserPlan(userEmail) : 'guest';
    const userRecord = userEmail ? getUserFullRecord(userEmail) : undefined;
    const limits = getPlanLimits(userPlan, userRecord?.stripe_subscription_status);
    const isPro = userPlan === 'pro' || userPlan === 'enterprise';

    logger.info('Analysis request received', { user: userEmail ?? 'anonymous', plan: userPlan, isPro });

    const { input, history, fingerprint, skipLimit: clientSkipLimit } = await req.json();

    const DEV_USERS = ["thiago.rojas@dngx.com.br"];
    let skipLimit = process.env.DISABLE_LIMIT === "true" || req.headers.get("x-dev-mode") === "true" || clientSkipLimit;
    if (userEmail && DEV_USERS.includes(userEmail)) skipLimit = true;

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json({ error: 'Input is required.' }, { status: 400 });
    }

    const ip = getClientIp(req);
    const rateLimit = checkIpLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.message }, { status: 429 });
    }
    incrementIpCount(ip);

    const identifier = userEmail || (fingerprint ? `fp:${fingerprint}` : `ip:${ip}`);
    const count = getDailyUsage(identifier, today);

    if (!isPro && !skipLimit && count >= limits.dailyAnalyses) {
      analytics.trackQuotaExhausted(userEmail || `anon:${identifier}`, userPlan);
      return NextResponse.json(buildLimitResponse(!!userEmail), { status: 429 });
    }

    const isProTasting = userEmail && userPlan === 'free' && count === (limits.dailyAnalyses - 1) && !hasUsedProTasting(userEmail);
    const effectivePlan = isProTasting ? 'pro' : userPlan;

    if (isProTasting) logger.info('Activating PRO tasting', { user: userEmail });

    const userHistory = userEmail ? getUserDecisions(userEmail) : [];
    const prompt = buildLayeredPrompt(effectivePlan, input, userHistory);

    const result = await aiOrchestrator(input, userHistory, effectivePlan, prompt);

    // Clean up malformed entries
    result.priorities = result.priorities.filter(p => p && typeof p === 'object' && p.task);

    if (!result.primary_action || typeof result.primary_action !== 'string') {
      result.primary_action = (result.priorities[0]?.task ? humanizeTask(result.priorities[0].task) : '');
    }

    if (isOverloadInput(input)) {
      result.priorities = result.priorities.map(p => ({ ...p, task: normalizeTitle(p.task) }));
    } else {
      // PHASE 2: Pipeline should not reinterpret ranking or alter structural priority
      const preSanitized = enforceCoverage(input, splitMergedTasks(deduplicatePriorities(result.priorities)));
      
      const sanitized = sanitizeTasks(preSanitized);
      const recovered = recoverCoverage(input, sanitized);
      const pipeline = deduplicatePriorities(recovered);

      result.priorities = enforceSingleHighPriority(pipeline)
        .map(p => ({ ...p, task: normalizeTitle(p.task) }));

      if (!result.priorities.some(p => p.level === 'alta') && result.primary_action) {
        const alreadyExists = result.priorities.some(p => normalizeTitle(p.task) === normalizeTitle(result.primary_action.replace(/\s+agora\.?$/i, '').replace(/[.!?]+$/, '')));
        if (!alreadyExists) {
          result.priorities = [{
            task: normalizeTitle(result.primary_action.replace(/\s+agora\.?$/i, '').replace(/[.!?]+$/, '')),
            level: 'alta',
            reason: 'Prioridade imediata identificada pelo motor de decisão.'
          }, ...result.priorities];
        }
      }

      result.primary_action = enforcePrimaryFromHigh(
        ensureCapitalization(makeMoreDecisive(enforceProAction(result.primary_action, result.priorities))),
        result.priorities
      );
    }

    const uniqueTasks = new Set<string>();
    result.priorities = result.priorities.filter(p => {
      const norm = normalizeTitle(p.task);
      if (uniqueTasks.has(norm)) return false;
      uniqueTasks.add(norm);
      return true;
    });

    if (result.priorities.length >= 3) {
      const levels = new Set(result.priorities.map(p => p.level));
      if (levels.size === 1) {
        logger.warn('Distribution collapse detected', { user: userEmail, bucket: result.priorities[0]?.level });
      }
    }

    if (result.priorities.length === 0 && result.primary_action) {
      result.priorities = [{ task: normalizeTitle(result.primary_action), level: 'alta', reason: 'Ação prioritária.' }];
    }

    if (!isPro && !skipLimit) {
      incrementDailyUsage(identifier, today);
    }

    const newCount = count + 1;
    if (userEmail) {
      try {
        saveUserDecision(userEmail, {
          id: crypto.randomUUID(),
          input,
          output: result,
          timestamp: Date.now()
        });
      } catch (dbErr) {
        logger.error('Failed to save history', dbErr);
      }
    }

    if (!userEmail && !skipLimit && newCount === 2) {
      return NextResponse.json({
        ...result,
        conversion_trigger: {
          title: "Gostou?",
          description: "Sua última análise gratuita pode ser PRO.",
          cta: "Cadastrar agora",
          link: "/auth/signup"
        }
      });
    }

    if (isProTasting && userEmail) {
      markProTastingUsed(userEmail);
      return NextResponse.json({ ...result, pro_tasting: true });
    }

    analytics.trackDecisionCreated(userEmail || `anon:${identifier}`, userPlan);
    return NextResponse.json(result);

  } catch (error: unknown) {
    logger.error('API Analyze internal error', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
  }
}
