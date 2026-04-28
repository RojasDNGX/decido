/**
 * Decido — Analytics Data Generator
 *
 * Paste and run in browser DevTools console while on: http://localhost:3000/decidir
 *
 * Covers all 5 scenarios without reloading the page.
 * API calls are fully mocked — no server quota is consumed.
 */
(async () => {
  const log = (msg) =>
    console.log(`%c[decido-gen] ${msg}`, 'color:#6366f1;font-weight:bold');

  if (!document.getElementById('task-input')) {
    log('ERROR — navigate to /decidir first, then re-run.');
    return;
  }

  // ── Intercept router navigation so the session (in-memory events) survives ──
  const _origPushState = history.pushState.bind(history);
  history.pushState = function (state, title, url) {
    if (url && String(url).includes('/limite')) {
      log('→ Navigation to /limite intercepted — session preserved');
      return;
    }
    return _origPushState(state, title, url);
  };

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const _origFetch = window.fetch;

  function mockFetch(status, body) {
    window.fetch = () =>
      Promise.resolve(
        new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      );
  }

  // ── React-compatible textarea setter ─────────────────────────────────────────
  function setInput(value) {
    const el = document.getElementById('task-input');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
      .set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // ── Wait until the "Analisando..." label disappears ──────────────────────────
  async function waitForIdle(ms = 10000) {
    await new Promise((r) => setTimeout(r, 250));
    const t = Date.now();
    while (Date.now() - t < ms) {
      const btn = document.getElementById('analyze-btn');
      if (btn && !btn.textContent.includes('Analisando')) return;
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  // ── Core analysis action ──────────────────────────────────────────────────────
  async function analyze(input) {
    setInput(input);
    await new Promise((r) => setTimeout(r, 150));
    document.getElementById('analyze-btn').click();
    await waitForIdle();
    await new Promise((r) => setTimeout(r, 500));
  }

  // ── Reset client-side limit (localStorage key from storage.ts) ───────────────
  function resetUsageCount() {
    localStorage.setItem('decido_usage_count', '0');
  }

  // ── Fixtures ─────────────────────────────────────────────────────────────────
  const INPUTS = [
    'Preciso pagar a fatura do cartão que vence hoje, estudar para a prova de amanhã e responder os e-mails do trabalho.',
    'Tenho que marcar uma consulta médica, terminar o relatório do projeto para sexta-feira e lavar a louça.',
    'Renovar o seguro do carro que vence semana que vem, comprar presente de aniversário para minha mãe e fazer supermercado.',
    'Pagar o condomínio, agendar a manutenção do ar condicionado e finalizar a apresentação para a diretoria amanhã.',
    'Fazer exercícios por 30 minutos, ler 10 páginas de um livro e terminar a funcionalidade nova do app.',
  ];

  const SUCCESS_BODY = {
    primary_action: 'Foco na tarefa de maior urgência imediata',
    reason: 'Prioridade definida por prazo e impacto direto.',
    priorities: [
      { task: 'Tarefa urgente', level: 'alta', reason: 'Vence hoje' },
      { task: 'Tarefa importante', level: 'média', reason: 'Importante mas pode esperar algumas horas' },
      { task: 'Tarefa baixa', level: 'baixa', reason: 'Sem prazo imediato' },
    ],
  };

  const LIMIT_BODY = {
    error: 'Limite diário de análises atingido. Tente novamente amanhã.',
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SCENARIO 1 — 5 successful analyses
  // ════════════════════════════════════════════════════════════════════════════
  log('SCENARIO 1 — Normal usage (5 successes)');
  mockFetch(200, SUCCESS_BODY);
  for (let i = 0; i < 5; i++) {
    log(`  attempt ${i + 1}/5`);
    await analyze(INPUTS[i % INPUTS.length]);
  }

  // Reset client-side usage counter (would block button otherwise)
  // Clear input so the example button becomes visible for scenario 2
  resetUsageCount();
  setInput('');
  await new Promise((r) => setTimeout(r, 400));

  // ════════════════════════════════════════════════════════════════════════════
  // SCENARIO 2 — 3 example clicks then 1 analysis
  // ════════════════════════════════════════════════════════════════════════════
  log('SCENARIO 2 — Example usage (3 clicks + 1 analysis)');
  mockFetch(200, SUCCESS_BODY);
  for (let i = 0; i < 3; i++) {
    const exBtn = document.getElementById('try-example-btn');
    if (exBtn) {
      exBtn.click();
      log(`  example click ${i + 1}/3`);
      await new Promise((r) => setTimeout(r, 350));
    } else {
      log(`  example button not found on click ${i + 1}`);
    }
  }
  // Analyze with whatever the last example set in the textarea
  const exInput = document.getElementById('task-input').value || INPUTS[0];
  await analyze(exInput);

  // ════════════════════════════════════════════════════════════════════════════
  // SCENARIO 3 — 2 forced network errors
  // ════════════════════════════════════════════════════════════════════════════
  log('SCENARIO 3 — Error simulation (2 network failures)');
  window.fetch = () => Promise.reject(new Error('Simulated network error'));
  for (let i = 0; i < 2; i++) {
    log(`  error ${i + 1}/2`);
    await analyze(INPUTS[i]);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCENARIO 4 — 2 × 429 (limit hits)
  // ════════════════════════════════════════════════════════════════════════════
  log('SCENARIO 4 — Limit simulation (2 × 429)');
  mockFetch(429, LIMIT_BODY);
  for (let i = 0; i < 2; i++) {
    log(`  limit trigger ${i + 1}/2`);
    await analyze(INPUTS[i % INPUTS.length]);
    await new Promise((r) => setTimeout(r, 300));
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCENARIO 5 — 2 retries after limit
  // ════════════════════════════════════════════════════════════════════════════
  log('SCENARIO 5 — Retry after limit (2 retries)');
  for (let i = 0; i < 2; i++) {
    log(`  retry ${i + 1}/2`);
    await analyze(INPUTS[(i + 1) % INPUTS.length]);
    await new Promise((r) => setTimeout(r, 300));
  }

  // ── Restore everything ───────────────────────────────────────────────────────
  window.fetch = _origFetch;
  history.pushState = _origPushState;

  log('══════════════════════════════════════');
  log('GENERATION COMPLETE');
  log('Run: decidoInsights()');
  log('══════════════════════════════════════');
})();
