import { test, expect } from '@playwright/test';

test.describe('Billing & Subscription Lifecycle', () => {

  test('checkout api requires authentication', async ({ page }) => {
    const res = await page.request.post('/api/billing/checkout');
    expect(res.status()).toBe(401);
  });

  test('billing portal requires authentication', async ({ page }) => {
    const res = await page.request.post('/api/billing/portal');
    expect(res.status()).toBe(401);
  });

  test('webhook handles malformed signatures gracefully', async ({ page }) => {
    const res = await page.request.post('/api/billing/webhook', {
      data: { id: 'evt_test' },
      headers: { 'stripe-signature': 'invalid_sig' }
    });
    expect(res.status()).toBe(400);
  });

  test('minha-conta renders billing section for guests as redirect', async ({ page }) => {
    await page.goto('/minha-conta');
    // Guest should be redirected to signin
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

});
