import { Plan } from '@/types';

export interface PlanLimits {
  dailyAnalyses: number;
  hasHistoryContext: boolean;
  hasRichAnalysis: boolean;
  maxTasksPerAnalysis: number;
}

export const PLANS: Record<Plan, PlanLimits> = {
  guest: {
    dailyAnalyses: 3,

    hasHistoryContext: false,
    hasRichAnalysis: false,
    maxTasksPerAnalysis: 8,
  },
  free: {
    dailyAnalyses: 3,
    hasHistoryContext: false,
    hasRichAnalysis: false,
    maxTasksPerAnalysis: 12,
  },

  pro: {
    dailyAnalyses: 100,
    hasHistoryContext: true,
    hasRichAnalysis: true,
    maxTasksPerAnalysis: 50,
  },
  enterprise: {
    dailyAnalyses: Infinity,
    hasHistoryContext: true,
    hasRichAnalysis: true,
    maxTasksPerAnalysis: 100,
  },
};

/**
 * Helpers para verificação de planos
 */
export function isGuest(plan: Plan): boolean {
  return plan === 'guest';
}

export function isFree(plan: Plan): boolean {
  return plan === 'free';
}

export function isPro(plan: Plan): boolean {
  return plan === 'pro' || plan === 'enterprise';
}

/**
 * Resolve os limites do plano garantindo fallbacks seguros
 */
export function getPlanLimits(plan: string | undefined): PlanLimits {
  if (plan === 'pro') return PLANS.pro;
  if (plan === 'enterprise') return PLANS.enterprise;
  if (plan === 'free') return PLANS.free;
  return PLANS.guest;
}

