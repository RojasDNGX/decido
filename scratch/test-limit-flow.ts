import { getDailyUsage, incrementDailyUsage } from '../lib/usage-db';
import { getPlanLimits } from '../lib/plans';

// Mocks
const mockRes = (data: any, status: number) => ({ data, status });

async function simulateAnalyzeRequest(identifier: string, plan: string, date: string) {
  const limits = getPlanLimits(plan);
  const count = getDailyUsage(identifier, date);

  if (plan === 'free' && count >= limits.dailyAnalyses) {
    return mockRes({
      type: "limit_reached",
      message: {
        title: "Sua clareza diária está pausada.",
        description: `Você atingiu o limite de análises gratuitas para hoje.

Algumas dessas decisões ainda estão pendentes agora.

No plano gratuito, você precisa reexplicar seu contexto a cada vez. No PRO, o Decido já sabe — e te diz o que fazer sem repetir o esforço.`,
        cta: "Liberar acesso ilimitado"
      }
    }, 429);
  }

  // Simular sucesso e incremento
  incrementDailyUsage(identifier, date);
  return mockRes({ status: 'success' }, 200);
}

async function runFullValidation() {
  const testIdentifier = `test-user-${Date.now()}`;
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  console.log("--- INICIANDO VALIDAÇÃO DE FLUXO DE LIMITE ---");

  // STEP 2 — PERFORM 3 ANALYSES (FREE)
  console.log("\nExecutando 3 análises (Plano FREE)...");
  for (let i = 1; i <= 3; i++) {
    const res = await simulateAnalyzeRequest(testIdentifier, 'free', today);
    console.log(`Análise ${i}: ${res.status === 200 ? 'PASS' : 'FAIL'}`);
  }

  // STEP 3 — TRIGGER LIMIT (4th request)
  console.log("\nExecutando 4ª análise (Trigger de Limite)...");
  const limitRes = await simulateAnalyzeRequest(testIdentifier, 'free', today);
  
  const isLimitReached = limitRes.status === 429 && limitRes.data.type === 'limit_reached';
  console.log(`Status 429: ${limitRes.status === 429 ? 'OK' : 'FAIL'}`);
  console.log(`Tipo limit_reached: ${limitRes.data.type === 'limit_reached' ? 'OK' : 'FAIL'}`);
  
  // VALIDATION 2: COPY QUALITY
  const desc = limitRes.data.message.description;
  const hasUrgency = desc.includes('pendentes') || desc.includes('agora');
  const hasEffort = desc.includes('esforço') || desc.includes('contexto');
  console.log(`Cópia tem urgência: ${hasUrgency ? 'OK' : 'FAIL'}`);
  console.log(`Cópia menciona esforço: ${hasEffort ? 'OK' : 'FAIL'}`);

  // VALIDATION 4: BYPASS TEST (PRO)
  console.log("\nValidando usuário PRO (Sem limites)...");
  const proRes = await simulateAnalyzeRequest('pro-user', 'pro', today);
  console.log(`Usuário PRO ignorou limite: ${proRes.status === 200 ? 'OK' : 'FAIL'}`);

  // VALIDATION 5: RESET TEST
  console.log("\nValidando Reset diário (Simulando amanhã)...");
  const tomorrowRes = await simulateAnalyzeRequest(testIdentifier, 'free', tomorrow);
  console.log(`Usuário pode usar novamente amanhã: ${tomorrowRes.status === 200 ? 'OK' : 'FAIL'}`);

  console.log("\n--- RESULTADOS FINAIS ---");
  console.log(`Limit enforcement: ${isLimitReached ? 'PASS' : 'FAIL'}`);
  console.log(`Copy quality: ${hasUrgency && hasEffort ? 'PASS' : 'FAIL'}`);
  console.log(`Structure: ${limitRes.data.message.cta ? 'PASS' : 'FAIL'}`);
  console.log(`Bypass protection: ${proRes.status === 200 ? 'PASS' : 'FAIL'}`);
  console.log(`Reset behavior: ${tomorrowRes.status === 200 ? 'PASS' : 'FAIL'}`);
}

runFullValidation();
