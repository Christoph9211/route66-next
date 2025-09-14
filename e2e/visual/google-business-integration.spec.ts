import { test, expect } from '@playwright/test';

// Update this path to the page where GoogleBusinessIntegration is rendered.
// For example: '/integrations/google-business' or '/settings/channels/google'
const TARGET_PATH = process.env.GOOGLE_BUSINESS_INTEGRATION_PATH || '/';

test.describe('Visual: GoogleBusinessIntegration', () => {
  test('component page visual snapshot', async ({ page }) => {
    await page.goto(TARGET_PATH);
    await page.waitForLoadState('networkidle');

    // If the component is conditionally rendered, consider scoping the screenshot
    // to a locator: await expect(page.locator('[data-testid="google-business-integration"]')).toHaveScreenshot();
    await expect(page).toHaveScreenshot('google-business-integration.png', {
      fullPage: true,
    });
  });
});

