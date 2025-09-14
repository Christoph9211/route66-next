import type { PlaywrightTestConfig } from '@playwright/test';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const config: PlaywrightTestConfig = {
  testDir: 'e2e',
  timeout: 30 * 1000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // Start the Next.js dev server for E2E/visual tests
  webServer: {
    command:
      process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ||
      (process.env.PACKAGE_MANAGER
        ? `${process.env.PACKAGE_MANAGER} run dev`
        : 'npm run dev'),
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: 'development',
      // Optionally toggle visibility of test-only routes or fixtures if you add them later
      // NEXT_PUBLIC_ENABLE_VISUAL_TEST_ROUTES: 'true',
    },
  },
};

export default config;

