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
}

REGRA DE DISTRIBUIÇÃO:
- EXATAMENTE UMA tarefa deve ser "alta" (a mais impactante/urgente).
- primary_action DEVE derivar da tarefa "alta".
- Quando existirem 3+ tarefas, use os três níveis (alta, média, baixa) para refletir diferença real de impacto.
- Nem toda tarefa relevante precisa ser "alta". Tarefas operacionais podem ser "média". Tarefas opcionais podem ser "baixa".
- Colapsar todas as tarefas no mesmo nível é resposta incorreta.`;

export const HEALTH_POLICY = `POLÍTICA GLOBAL DE SEGURANÇA E SAÚDE (ESTRITA):
1. DIVISÃO DE DEPENDENTES:
   - SEGURANÇA (filho na escola, veterinário por doença/estranheza, emergência): Prioridade ALTA (#1).
   - MANUTENÇÃO (banho, passear, ração, tosa, rotina): Prioridade NORMAL (conforme urgência real).
2. PROIBIÇÃO DE ESCALAÇÃO DE DOMÍNIO:
   - NUNCA invente recomendações médicas, saúde ou segurança a partir de estados emocionais ou cansaço.
   - "Descansar" é uma pausa, NÃO é uma emergência de saúde.
   - Interprete o tom, mas não crie novos domínios (médico, hospital, etc) se não citados explicitamente.
3. LIMITE DE INFERÊNCIA:
   - Só inferir saúde/vida se for semanticamente explícito. Na dúvida sobre pets/filhos, use MANUTENÇÃO.`;

