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
 * Resolve os limites do plano garantindo fallbacks seguros e considerando o status da Stripe
 */
export function getPlanLimits(plan: string | undefined, status?: string | null): PlanLimits {
  const isActive = isSubscriptionActive(status);
  
  if (plan === 'enterprise') return PLANS.enterprise;
  if (plan === 'pro' && isActive) return PLANS.pro;
  
  // Fallback para free se pro não estiver ativo (ex: payment failed ou canceled)
  if (plan === 'free' || (plan === 'pro' && !isActive)) return PLANS.free;
  
  return PLANS.guest;
}

/**
 * Define se uma assinatura é considerada válida para acesso aos recursos
 */
export function isSubscriptionActive(status?: string | null): boolean {
  if (!status) return false;
  
  const activeStatuses = ['active', 'trialing', 'past_due']; 
  // Nota: 'past_due' incluído aqui para permitir o Grace Period (Fase 6)
  
  return activeStatuses.includes(status);
}

