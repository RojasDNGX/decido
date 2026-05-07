import { Plan } from '@/types';

export interface PlanLimits {
  dailyAnalyses: number;
  hasHistoryContext: boolean;
  hasRichAnalysis: boolean;
  maxTasksPerAnalysis: number;
}

export const PLANS: Record<Plan, PlanLimits> = {
  free: {
    dailyAnalyses: 3,
    hasHistoryContext: false,
    hasRichAnalysis: false,
    maxTasksPerAnalysis: 10,
  },
  pro: {
    dailyAnalyses: Infinity,
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
export function isFree(plan: Plan): boolean {
  return plan === 'free';
}

export function isPro(plan: Plan): boolean {
  return plan === 'pro';
}

export function isEnterprise(plan: Plan): boolean {
  return plan === 'enterprise';
}

/**
 * Resolve os limites do plano garantindo fallbacks seguros
 */
export function getPlanLimits(plan: string | undefined): PlanLimits {
  if (plan === 'pro') return PLANS.pro;
  if (plan === 'enterprise') return PLANS.enterprise;
  return PLANS.free;
}
