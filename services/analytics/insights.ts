import { MetricEvent } from './metrics';

const EMPTY = { attempts: 0, success_rate: 0, error_rate: 0, limit_rate: 0, example_usage_rate: 0 };

export function getInsights() {
  if (typeof window === 'undefined') return EMPTY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events: MetricEvent[] = (window as any).__DECIDO_EVENTS__ || [];

  const started  = events.filter(e => e.event === 'analyze_started');
  const success  = events.filter(e => e.event === 'analyze_success');
  const errors   = events.filter(e => e.event === 'analyze_error');
  const limited  = events.filter(e => e.event === 'limit_reached');
  const examples = events.filter(e => e.event === 'example_used');

  const startedCount = started.length;

  const totalAttempts = new Set(
    started
      .map(e => e.meta?.attempt_id as string | undefined)
      .filter((id): id is string => Boolean(id))
  ).size;

  const uniqueUsers = new Set(
    events.map(e => e.userId).filter((id): id is string => Boolean(id))
  ).size;

  return {
    attempts: totalAttempts,
    success_rate: startedCount ? success.length / startedCount : 0,
    error_rate:   startedCount ? errors.length  / startedCount : 0,
    limit_rate:   startedCount ? limited.length / startedCount : 0,
    example_usage_rate: uniqueUsers ? examples.length / uniqueUsers : 0,
  };
}

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).decidoInsights = getInsights;
}
