import { test, expect } from '@playwright/test';

const MOCK_RESULT = {
  primary_action: 'Pagar a fatura do cartão',
  reason: 'Vence hoje e tem maior urgência financeira.',
  priorities: [
    { task: 'Pagar conta', level: 'alta', reason: 'Prazo vencendo hoje' },
    { task: 'Sair para jantar', level: 'baixa', reason: 'Sem urgência imediata' },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route('/api/analyze', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_RESULT),
    });
  });
});

// Wait for the component to reach its mounted (client-hydrated) state.
// The .quick-actions div only renders when mounted=true; interacting before
// that causes a re-mount (key change) that resets all state.
async function waitForMount(page: import('@playwright/test').Page) {
  await page.waitForSelector('.quick-actions', { state: 'visible' });
}

test('user can make a decision', async ({ page }) => {
  await page.goto('/decidir');
  await waitForMount(page);

  await page.fill('textarea', 'Pagar conta ou sair para jantar');
  await page.click('button:has-text("Analisar")');

  await expect(page.locator('.result-section')).toBeVisible({ timeout: 10000 });
});

test('example fills input without auto submit', async ({ page }) => {
  await page.goto('/decidir');
  await waitForMount(page);

  await page.click('button#try-example-btn');
  await expect(page.locator('textarea')).not.toHaveValue('');

  const value = await page.locator('textarea').inputValue();
  expect(value.length).toBeGreaterThan(0);

  await expect(page.locator('.result-section')).not.toBeVisible();
});

test('limit redirects user', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('decido_usage_count', '4');
  });

  await page.goto('/decidir');
  await waitForMount(page);

  await page.fill('textarea', 'Teste de limite de uso');
  await page.click('button:has-text("Analisar")');

  await expect(page).toHaveURL(/\/limite/, { timeout: 10000 });
});

test('user can adjust priority without breaking UI', async ({ page }) => {
  await page.goto('/decidir');
  await waitForMount(page);

  await page.fill('textarea', 'Trabalhar ou descansar');
  await page.click('button:has-text("Analisar")');

  await expect(page.locator('.result-section')).toBeVisible({ timeout: 10000 });

  // Click ↑ on the "baixa" item (last ↑ button — "alta" ↑ is disabled)
  const upButton = page.locator('button[aria-label="Aumentar prioridade"]').last();
  await upButton.click();

  await expect(page.locator('text=Ajustado por você')).toBeVisible();
});
