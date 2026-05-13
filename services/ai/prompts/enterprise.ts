/**
 * enterprise.ts — ENTERPRISE plan decision brain.
 *
 * Placeholder: extends PRO with team and project-level analysis.
 * Full behavior to be defined in a future sprint.
 *
 * Current behavior: identical to PRO.
 *
 * Reserved capabilities (not yet active):
 * - Multi-assignee prioritization
 * - Project-level blocking detection
 * - Systemic bottleneck identification
 * - Cross-team dependency mapping
 */

import { buildPrompt as buildProPrompt } from './pro';

type HistoryItem = { input_summary: string; primary_action: string };

// ENTERPRISE currently delegates to PRO brain.
// When ENTERPRISE behavior is defined, replace this function body.
export function buildPrompt(input: string, history?: HistoryItem[]): string {
  return buildProPrompt(input, history);
}
