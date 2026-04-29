export type EventName =
  | 'page_view'
  | 'analyze_started'
  | 'analyze_success'
  | 'analyze_error'
  | 'limit_reached'
  | 'example_used'
  | 'history_opened'
  | 'copy_action'
  | 'share_action'
  | 'clear_data';

export interface MetricEvent {
  event: EventName;
  userId?: string;
  timestamp: number;
  meta?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny = typeof window !== 'undefined' ? (window as any) : {};
if (!globalAny.__DECIDO_EVENTS__) globalAny.__DECIDO_EVENTS__ = [];
export const events: MetricEvent[] = globalAny.__DECIDO_EVENTS__;

export const logEvent = (event: EventName, userId?: string, meta?: Record<string, unknown>): void => {
  const payload: MetricEvent = {
    event,
    userId,
    timestamp: Date.now(),
    meta,
  };

  console.log('[decido:metric]', JSON.stringify(payload));
  events.push(payload);
};
