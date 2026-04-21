import { Decision } from '@/types';

export const STORAGE_KEYS = {
  USER_ID: 'decido_user_id',
  DECISIONS: 'decido_history',
  USAGE_COUNT: 'decido_usage_count',
};

export const MAX_FREE_ANALYSES = 5;

export const getUsageCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(STORAGE_KEYS.USAGE_COUNT);
  return stored ? parseInt(stored, 10) : 0;
};

export const incrementUsageCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const count = getUsageCount() + 1;
  localStorage.setItem(STORAGE_KEYS.USAGE_COUNT, String(count));
  return count;
};

export const isLimitReached = (): boolean => {
  return getUsageCount() >= MAX_FREE_ANALYSES;
};

export const getRemainingUsage = (): number => {
  return Math.max(MAX_FREE_ANALYSES - getUsageCount(), 0);
};

export const getUserId = (): string => {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }

  return userId;
};

export const saveDecision = (decision: Omit<Decision, 'id' | 'timestamp'>): void => {
  if (typeof window === 'undefined') return;

  const history = getDecisions();
  const newDecision: Decision = {
    ...decision,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  const updatedHistory = [newDecision, ...history].slice(0, 5);
  localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(updatedHistory));
};

export const getDecisions = (): Decision[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEYS.DECISIONS);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse decisions history', e);
    return [];
  }
};

export const clearData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.DECISIONS);
};
