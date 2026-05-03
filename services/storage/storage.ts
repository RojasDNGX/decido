import { Decision } from '@/types';

export const STORAGE_KEYS = {
  USER_ID: 'decido_user_id',
  DECISIONS: 'decido_history',
  USAGE_COUNT: 'decido_usage_count',
  ONBOARDING_DONE: 'decido_onboarding_done',
};

export const MAX_FREE_ANALYSES = 3;

export const getUsageCount = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USAGE_COUNT);
    return stored ? parseInt(stored, 10) : 0;
  } catch (e) {
    console.warn('LocalStorage usage count inaccessible', e);
    return 0;
  }
};

export const incrementUsageCount = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const count = getUsageCount() + 1;
    localStorage.setItem(STORAGE_KEYS.USAGE_COUNT, String(count));
    return count;
  } catch (e) {
    console.warn('Failed to increment usage count', e);
    return 0;
  }
};

export const isLimitReached = (): boolean => {
  try {
    return getUsageCount() >= MAX_FREE_ANALYSES;
  } catch {
    return false;
  }
};

export const getRemainingUsage = (): number => {
  try {
    return Math.max(MAX_FREE_ANALYSES - getUsageCount(), 0);
  } catch {
    return MAX_FREE_ANALYSES;
  }
};

export const isOnboardingDone = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
  } catch {
    return true; // Default to true to not block user
  }
};

export const setOnboardingDone = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
  } catch (e) {
    console.warn('Failed to save onboarding state', e);
  }
};

export const getUserId = (): string => {
  if (typeof window === 'undefined') return '';

  try {
    let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

    if (!userId) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        userId = crypto.randomUUID();
      } else {
        // Fallback for non-secure contexts (HTTP)
        userId = 'user_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      }
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }

    return userId;
  } catch (e) {
    console.warn('LocalStorage userId inaccessible, using memory fallback', e);
    return 'temp_' + Date.now();
  }
};

export const saveDecision = (decision: Omit<Decision, 'id' | 'timestamp'>): void => {
  if (typeof window === 'undefined') return;

  try {
    const history = getDecisions();
    const newDecision: Decision = {
      ...decision,
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'id_' + Date.now(),
      timestamp: Date.now(),
    };

    const updatedHistory = [newDecision, ...history].slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(updatedHistory));
  } catch (e) {
    console.warn('Failed to save decision to history', e);
  }
};

export const getDecisions = (): Decision[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DECISIONS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.warn('Failed to get decisions from history', e);
    return [];
  }
};

export const getCompactHistory = (): { input_summary: string; primary_action: string }[] =>
  getDecisions()
    .slice(0, 5)
    .map(d => ({
      input_summary: d.input.replace(/\s+/g, ' ').trim().slice(0, 80),
      primary_action: (d.output.primary_action || d.output.recommended_action || '').trim(),
    }))
    .filter(h => h.primary_action);

export const clearData = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.DECISIONS);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DONE);
  } catch (e) {
    console.warn('Failed to clear localStorage data', e);
  }
};
