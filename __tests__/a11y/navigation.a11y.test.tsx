import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Navigation from '../../components/Navigation';

describe('Accessibility: Navigation', () => {
    test('has no accessibility violations', async () => {
        const { container } = render(<Navigation />);

        // Sanity check
        expect(container).toBeTruthy();

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    test('has proper ARIA attributes on navigation', () => {
        const { getByRole } = render(<Navigation />);

        const nav = getByRole('navigation', { name: 'Primary' });
        expect(nav).toBeInTheDocument();
    });

    test('mobile menu button has proper ARIA attributes', () => {
        const { getByRole } = render(<Navigation />);

        const menuButton = getByRole('button', { name: /menu/i });
        expect(menuButton).toHaveAttribute('aria-expanded');
        expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    test('navigation links have proper structure', () => {
        const { getAllByRole } = render(<Navigation />);

        const links = getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        // Check that links have href attributes
        links.forEach(link => {
            expect(link).toHaveAttribute('href');
        });
    });
});
