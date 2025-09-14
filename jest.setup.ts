import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest with axe matchers
expect.extend(toHaveNoViolations);

// Reduce noisy error logs during tests when React acts on async timers
// and to avoid unhandled rejection from test setups that conditionally skip
process.on('unhandledRejection', () => {});

