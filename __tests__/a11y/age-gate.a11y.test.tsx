import React from 'react';
import { render, act } from '@testing-library/react';
import { axe } from 'jest-axe';

// Mock js-cookie before importing AgeGate
jest.mock('js-cookie', () => ({
    get: jest.fn(() => undefined),
    set: jest.fn(),
}));

import AgeGate from '../../components/AgeGate';

describe('Accessibility: AgeGate', () => {
    test('component renders without errors', () => {
        const { container } = render(<AgeGate />);
        expect(container).toBeTruthy();
    });

    test('has no accessibility violations when rendered', async () => {
        const { container } = render(<AgeGate />);

        // Wait for async rendering with act()
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        // Run axe on whatever is rendered
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
