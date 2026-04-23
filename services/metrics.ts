export type EventName =
  | 'page_view'
  | 'analyze_started'
  | 'analyze_success'
  | 'analyze_error'
  | 'limit_reached'
  | 'example_used'
  | 'history_opened'
  | 'copy_action'
  | 'clear_data';

export interface MetricEvent {
  event: EventName;
  userId?: string;
  timestamp: number;
  meta?: Record<string, unknown>;
}

export const logEvent = (event: EventName, userId?: string, meta?: Record<string, unknown>): void => {
  const payload: MetricEvent = {
    event,
    userId,
    timestamp: Date.now(),
    meta,
  };

  // Structured log visible in browser console and server terminal
  console.log('[decido:metric]', JSON.stringify(payload));
};
