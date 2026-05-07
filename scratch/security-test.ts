/**
 * Script de Simulação de Segurança de Planos
 * Este script valida se o backend ignora inputs maliciosos no corpo da requisição.
 */

// Mocks
const mockDatabase = {
  'free@example.com': 'free',
  'pro@example.com': 'pro'
};

function getUserPlan(email: string): string {
  return mockDatabase[email as keyof typeof mockDatabase] || 'free';
}

function selectPromptBuilder(plan: string) {
  return plan === 'pro' ? 'PRO_PROMPT_BUILDER' : 'FREE_PROMPT_BUILDER';
}

// Lógica simplificada do orchestrator.ts
function aiOrchestrator(input: string, history: any[], plan: string) {
  const safeHistory = plan === 'free' ? undefined : history;
  const promptBuilder = selectPromptBuilder(plan);
  
  return {
    usedPlan: plan,
    usedPrompt: promptBuilder,
    usedHistory: safeHistory,
    status: 'success'
  };
}

// Lógica simplificada do route.ts
async function simulateRequest(userEmail: string | null, body: any) {
  // Resolve plano pelo servidor/DB (Não confia no body)
  const userPlan = userEmail ? getUserPlan(userEmail) : 'free';
  
  // Extrai apenas o necessário do body (ignora 'plan' se enviado)
  const { input, history } = body;
  
  console.log(`\n--- Simulação para ${userEmail ?? 'Anônimo'} ---`);
  console.log(`Body enviado:`, JSON.stringify(body));
  
  const result = aiOrchestrator(input, history, userPlan);
  
  console.log(`Plano Resolvido (Server): ${userPlan}`);
  console.log(`Prompt Utilizado: ${result.usedPrompt}`);
  console.log(`Histórico Processado: ${result.usedHistory ? 'Sim' : 'Ignorado (Segurança)'}`);
  
  return result;
}

async function runTests() {
  console.log("Iniciando Testes de Segurança de Plano...");

  // TEST 1 — PLAN SPOOFING
  // Usuário FREE tenta se passar por PRO enviando plan: "pro" no body
  const test1 = await simulateRequest('free@example.com', {
    input: "minhas tarefas",
    plan: "pro", // Tentativa de spoofing
    history: [{ input_summary: "aula", primary_action: "estudar" }]
  });

  // TEST 2 — HISTORY INJECTION
  // Usuário FREE tenta enviar histórico para ganhar contexto
  const test2 = await simulateRequest('free@example.com', {
    input: "outra tarefa",
    history: [{ input_summary: "injetado", primary_action: "hack" }]
  });

  // TEST 3 — INVALID PLAN / PRIVILEGE ESCALATION
  // Usuário tenta enviar planos inexistentes ou administrativos
  const test3 = await simulateRequest('free@example.com', {
    input: "ataque",
    plan: "admin"
  });

  // TEST 4 — VALID PRO (Control)
  const test4 = await simulateRequest('pro@example.com', {
    input: "tarefa pro",
    history: [{ input_summary: "ontem", primary_action: "trabalhar" }]
  });
}

runTests();
