/**
 * shared.ts — Format and language rules ONLY.
 *
 * This file must NEVER contain:
 * - Priority logic
 * - Reasoning rules
 * - Validation instructions
 * - Consequence enforcement
 *
 * Each plan's intelligence lives entirely in its own prompt file.
 */

export const LANGUAGE_RULE = `Responda exclusivamente em português do Brasil (pt-BR). É proibido usar qualquer palavra em inglês.`;

export const OUTPUT_FORMAT = `FORMATO DE SAÍDA (JSON ESTRITO):
{
"primary_action": "string",
"reason": "string",
"priorities": [
  {
    "task": "string",
    "level": "alta | média | baixa",
    "reason": "string"
  }
]
}`;
