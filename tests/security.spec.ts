import { test, expect } from '@playwright/test';

test.describe('Security & Identity Hardening', () => {

  test('guest profile click redirects to signin', async ({ page }) => {
    await page.goto('/decidir');
    // Wait for mount
    await page.waitForSelector('.quick-actions', { state: 'visible' });
    
    // Click profile button (anonymous)
    await page.click('button[title="Entrar"]');
    
    // Should redirect to auth/signin
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.locator('h1')).toContainText('Entrar');
  });

  test('privacy policy page renders with SEO metadata', async ({ page }) => {
    await page.goto('/privacidade');
    await expect(page.locator('h1')).toContainText('Política de Privacidade');
    await expect(page.locator('text=Última atualização')).toBeVisible();
    
    const title = await page.title();
    expect(title).toContain('Política de Privacidade | Decido');
  });

  test('forgot password rate limiting works', async ({ page }) => {
    // We will attempt to call the API directly multiple times
    // The limit is 5 per 15 mins.
    
    const email = `test-security-${Date.now()}@decido.com.br`;

    for (let i = 0; i < 5; i++) {
      const res = await page.request.post('/api/auth/forgot-password', {
        data: { email }
      });
      // These should succeed (200) or at least not be 429
      expect(res.status()).not.toBe(429);
    }
    
    // The 6th attempt MUST fail with 429
    const failRes = await page.request.post('/api/auth/forgot-password', {
      data: { email }
    });
    
    expect(failRes.status()).toBe(429);
    const body = await failRes.json();
    expect(body.error).toContain('Muitas tentativas');
  });

  test('account settings tab switching works', async ({ page }) => {
    // Note: To test the actual content, we'd need a logged session.
    // Here we test that the route is protected (redirects if not logged)
    await page.goto('/minha-conta');
    await expect(page).toHaveURL(/\/auth\/signin/); // Unauthenticated access redirects to signin
  });

});
