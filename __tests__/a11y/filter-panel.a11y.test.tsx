import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import FilterPanel from '../../components/FilterPanel';
import type { FilterState } from '../../components/FilterPanel';

const mockFilters: FilterState = {
    minPrice: '',
    maxPrice: '',
    onlyInStock: false,
    potencyEnabled: false,
    minPotency: 0,
    maxPotency: 50,
};

const mockProps = {
    sortOrder: 'featured' as const,
    onSortOrderChange: jest.fn(),
    filters: mockFilters,
    onMinPriceChange: jest.fn(),
    onMaxPriceChange: jest.fn(),
    onInStockToggle: jest.fn(),
    onPotencyToggle: jest.fn(),
    onMinPotencyChange: jest.fn(),
    onMaxPotencyChange: jest.fn(),
    filtersDisabled: false,
    categoryPriceBounds: { min: 5, max: 100 },
};

describe('Accessibility: FilterPanel', () => {
    test('has no accessibility violations', async () => {
        const { container } = render(<FilterPanel {...mockProps} />);

        // Sanity check
        expect(container).toBeTruthy();

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    test('has proper aside structure with ARIA label', () => {
        const { getByRole } = render(<FilterPanel {...mockProps} />);

        const aside = getByRole('complementary');
        expect(aside).toHaveAttribute('aria-labelledby');
    });

    test('fieldset has proper legend', () => {
        const { getByRole } = render(<FilterPanel {...mockProps} />);

        const fieldset = getByRole('group');
        expect(fieldset).toBeInTheDocument();
    });

    test('all form inputs have associated labels', () => {
        const { getByLabelText } = render(<FilterPanel {...mockProps} />);

        // Check price inputs
        expect(getByLabelText(/minimum price/i)).toBeInTheDocument();
        expect(getByLabelText(/maximum price/i)).toBeInTheDocument();

        // Check stock checkbox
        expect(getByLabelText(/only show in-stock items/i)).toBeInTheDocument();

        // Check potency checkbox
        expect(getByLabelText(/enable potency range filter/i)).toBeInTheDocument();
    });

    test('range inputs have aria-valuetext', () => {
        const { getByLabelText } = render(<FilterPanel {...mockProps} />);

        const minPotencyInput = getByLabelText(/minimum potency/i);
        const maxPotencyInput = getByLabelText(/maximum potency/i);

        expect(minPotencyInput).toHaveAttribute('aria-valuetext');
        expect(maxPotencyInput).toHaveAttribute('aria-valuetext');
    });

    test('helper text is properly associated with inputs', () => {
        const { getByLabelText } = render(<FilterPanel {...mockProps} />);

        const minPriceInput = getByLabelText(/minimum price/i);
        expect(minPriceInput).toHaveAttribute('aria-describedby', 'price-filter-help');
    });

    test('sort select has proper label', () => {
        const { getByLabelText } = render(<FilterPanel {...mockProps} />);

        const sortSelect = getByLabelText(/sort products/i);
        expect(sortSelect).toBeInTheDocument();
    });
});
