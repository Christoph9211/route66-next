import nextJest from 'next/jest.js'

// Create a Jest config that leverages Next.js' SWC/babel settings
const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/**/*.spec.{js,jsx,ts,tsx}',
  ],
  moduleNameMapper: {
    // Handle module aliases if using `baseUrl` or `paths` in tsconfig
    '^@/(.*)$': '<rootDir>/$1',
  },
}

const config = createJestConfig(customJestConfig)

export default config

