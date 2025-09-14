# Testing: Accessibility and Visual Regression

This project now includes scaffolding for:

- Accessibility tests for React components using `@testing-library/react` and `jest-axe`.
- Visual regression tests using Playwright screenshots.

## Install Dev Dependencies

Install the following dev dependencies to enable both test suites:

```bash
# with npm
npm i -D jest @types/jest @testing-library/react @testing-library/jest-dom jest-axe

# Playwright for visual regression
npm i -D @playwright/test
npx playwright install

# If using Yarn
yarn add -D jest @types/jest @testing-library/react @testing-library/jest-dom jest-axe @playwright/test
npx playwright install

# If using pnpm
pnpm add -D jest @types/jest @testing-library/react @testing-library/jest-dom jest-axe @playwright/test
npx playwright install
```

If your app uses TypeScript, `next/jest` (provided by Next.js) is used via `jest.config.js` and requires no extra install beyond `next`.

## Package Scripts

Add these scripts to `package.json` for convenience:

```json
{
  "scripts": {
    "test": "jest",
    "test:a11y": "jest __tests__/a11y",
    "test:vr": "playwright test e2e/visual",
    "test:vr:update": "playwright test e2e/visual --update-snapshots"
  }
}
```

## Accessibility Tests

- Config: `jest.config.js`, setup: `jest.setup.ts`.
- Example test: `__tests__/a11y/google-business-integration.a11y.test.tsx`.

Update `componentProps` in the test to satisfy any required props for `GoogleBusinessIntegration`.

Run:

```bash
npm run test:a11y
```

## Visual Regression Tests

- Config: `playwright.config.ts`.
- Example tests:
  - `e2e/visual/home.spec.ts` — home page screenshot
  - `e2e/visual/google-business-integration.spec.ts` — points to a page path via `GOOGLE_BUSINESS_INTEGRATION_PATH`

Set the target path if your component lives on a specific route:

```bash
set GOOGLE_BUSINESS_INTEGRATION_PATH=/integrations/google-business & npm run test:vr
```

On Unix shells:

```bash
GOOGLE_BUSINESS_INTEGRATION_PATH=/integrations/google-business npm run test:vr
```

Create/update snapshot baselines locally:

```bash
npm run test:vr:update
```

Notes:

- The Playwright config auto-starts the Next.js dev server on port 3000 via `npm run dev`. Adjust `PORT`, `PACKAGE_MANAGER`, or `PLAYWRIGHT_WEB_SERVER_COMMAND` env vars if needed.
- For more targeted screenshots, add `data-testid="google-business-integration"` to the component’s root and scope the screenshot to that locator in `google-business-integration.spec.ts`.
