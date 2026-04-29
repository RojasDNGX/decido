/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('@playwright/test');

const MOCK_RESULT = {
  primary_action: 'Responder e-mail urgente',
  reason: 'Alta urgência',
  priorities: [
    { task: 'Responder e-mail', level: 'alta', reason: 'Urgente' },
    { task: 'Organizar arquivos', level: 'baixa', reason: 'Pode esperar' },
  ],
};

async function mockRoute(page) {
  await page.route('/api/analyze', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_RESULT),
    });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // --- TEST 1: analyze flow + insights ---
  const page1 = await browser.newPage();
  await mockRoute(page1);
  await page1.goto('http://localhost:3001/decidir');
  await page1.waitForSelector('.quick-actions', { state: 'visible' });

  await page1.fill('textarea', 'Responder e-mail urgente e organizar arquivos');
  await page1.click('button:has-text("Analisar")');
  await page1.waitForSelector('.result-section', { timeout: 10000 });

  const events1 = await page1.evaluate(() => window.__DECIDO_EVENTS__ || []);
  const insights = await page1.evaluate(() => window.decidoInsights ? window.decidoInsights() : null);

  const startedEvent = events1.find(e => e.event === 'analyze_started');
  const successEvent = events1.find(e => e.event === 'analyze_success');

  // --- TEST 2: example_used on fresh page ---
  const page2 = await browser.newPage();
  await mockRoute(page2);
  await page2.goto('http://localhost:3001/decidir');
  await page2.waitForSelector('.quick-actions', { state: 'visible' }); // wait for full hydration
  await page2.click('button#try-example-btn');

  const events2 = await page2.evaluate(() => window.__DECIDO_EVENTS__ || []);

  const report = {
    '--- Análise de Eventos ---': '',
    page_view:              events1.some(e => e.event === 'page_view'),
    analyze_started:        events1.some(e => e.event === 'analyze_started'),
    analyze_success:        events1.some(e => e.event === 'analyze_success'),
    example_used:           events2.some(e => e.event === 'example_used'),
    '--- attempt_id ---': '',
    attempt_id_consistent:  startedEvent?.meta?.attempt_id === successEvent?.meta?.attempt_id,
    attempt_id_present:     Boolean(startedEvent?.meta?.attempt_id),
    '--- Duplicatas ---': '',
    duplicate_started:      events1.filter(e => e.event === 'analyze_started').length > 1,
    duplicate_success:      events1.filter(e => e.event === 'analyze_success').length > 1,
    '--- decidoInsights() ---': '',
    insights_returned:      insights !== null,
    insights,
  };

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
