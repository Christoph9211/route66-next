import { test, expect } from '@playwright/test';

test.describe('Visual: Home page', () => {
  test('home page visual snapshot', async ({ page }) => {
    await page.goto('/');
    // Wait for network to settle to reduce flakiness
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home.png', { fullPage: true });
  });
});

