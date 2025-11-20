import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../types/product';

const mockProduct: Product = {
    name: 'Test Product',
    category: 'Flower',
    image: '/test-image.jpg',
    size_options: ['1g', '3.5g', '7g'],
    prices: {
        '1g': 10,
        '3.5g': 30,
        '7g': 50,
    },
    availability: {
        '1g': true,
        '3.5g': true,
        '7g': true,
    },
    thca_percentage: 25,
    banner: 'New',
};

describe('Accessibility: ProductCard', () => {
    test('has no accessibility violations', async () => {
        const { container } = render(<ProductCard product={mockProduct} />);

        // Sanity check
        expect(container).toBeTruthy();

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    test('has proper article structure with ARIA labels', () => {
        const { getByRole } = render(<ProductCard product={mockProduct} />);

        const article = getByRole('article');
        expect(article).toHaveAttribute('aria-labelledby');
        expect(article).toHaveAttribute('aria-describedby');
    });

    test('size selection buttons have proper ARIA attributes', () => {
        const { getAllByRole } = render(<ProductCard product={mockProduct} />);

        const sizeButtons = getAllByRole('button').filter(btn =>
            btn.getAttribute('aria-pressed') !== null
        );

        expect(sizeButtons.length).toBeGreaterThan(0);
        sizeButtons.forEach(button => {
            expect(button).toHaveAttribute('aria-pressed');
            expect(button).toHaveAttribute('aria-label');
        });
    });

    test('add to cart button has proper attributes', () => {
        const { getByRole } = render(<ProductCard product={mockProduct} />);

        const addToCartButton = getByRole('button', { name: /add to cart/i });
        expect(addToCartButton).toBeInTheDocument();
    });

    test('out of stock product has proper disabled state', () => {
        const outOfStockProduct: Product = {
            ...mockProduct,
            availability: {
                '1g': false,
                '3.5g': false,
                '7g': false,
            },
        };

        const { getByRole } = render(<ProductCard product={outOfStockProduct} />);

        const addToCartButton = getByRole('button', { name: /out of stock/i });
        expect(addToCartButton).toBeDisabled();
        expect(addToCartButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('image has proper alt text', () => {
        const { getByAltText } = render(<ProductCard product={mockProduct} />);

        const image = getByAltText(mockProduct.name);
        expect(image).toBeInTheDocument();
    });
});
