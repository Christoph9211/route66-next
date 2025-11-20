import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import type { Product } from '@/types/product'
import HomePage from '@/components/HomePage'

jest.mock('@/hooks/useNavigation', () => ({
    useKeyboardNavigation: jest.fn(),
}))

jest.mock('@/utils/autoContrast', () => ({
    applyAutoContrast: jest.fn(),
}))

function createMockComponent(testId: string, element: React.ElementType = 'div') {
    const MockComponent = (props: Record<string, unknown>) =>
        React.createElement(element, { 'data-testid': testId, ...props })

    MockComponent.displayName = `Mock${testId.charAt(0).toUpperCase()}${testId.slice(1)}`

    return MockComponent
}

jest.mock('@/components/Navigation', () => createMockComponent('navigation', 'nav'))
jest.mock('@/components/FooterNavigation', () => createMockComponent('footer', 'footer'))
jest.mock('@/components/QuickNavigation', () => createMockComponent('quick-nav'))
jest.mock('@/components/LocalSEOFAQ', () => createMockComponent('faq', 'section'))
jest.mock('@/components/LocationContent', () => createMockComponent('location', 'section'))
jest.mock('@/components/GoogleBusinessIntegration', () => createMockComponent('google', 'section'))
jest.mock('@/components/HeroSection', () => createMockComponent('hero', 'section'))
jest.mock('@/components/AboutSection', () => createMockComponent('about', 'section'))
jest.mock('@/components/ContactSection', () => createMockComponent('contact', 'section'))

const mockProducts: Product[] = [
    {
        name: 'Budget Flower',
        category: 'Flower',
        size_options: ['1/8'],
        prices: {
            '1/8': 15,
        },
        thca_percentage: 15,
        availability: {
            '1/8': true,
        },
    },
    {
        name: 'Premium Flower',
        category: 'Flower',
        size_options: ['1/8'],
        prices: {
            '1/8': 60,
        },
        thca_percentage: 28,
        availability: {
            '1/8': true,
        },
    },
    {
        name: 'Unavailable Flower',
        category: 'Flower',
        size_options: ['1/8'],
        prices: {
            '1/8': 20,
        },
        thca_percentage: 22,
        availability: {
            '1/8': false,
        },
    },
    {
        name: 'Tasty Gummies',
        category: 'Edibles',
        size_options: ['Pack'],
        prices: {
            Pack: 25,
        },
        thca_percentage: 5,
        availability: {
            Pack: true,
        },
    },
]

const renderHomePage = () => {
    render(<HomePage products={mockProducts} />)
}

const selectCategory = async (label: string) => {
    const categoryTab = await screen.findByRole('tab', { name: new RegExp(label, 'i') })
    fireEvent.click(categoryTab)
}

describe('HomePage filters', () => {
    it('filters products by price range', async () => {
        renderHomePage()
        await selectCategory('Flower')

        const productSection = screen.getByRole('region', { name: /Our Premium Hemp Products/i })

        expect(await within(productSection).findByText('Budget Flower')).toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/Minimum price/i), { target: { value: '30' } })

        expect(within(productSection).queryByText('Budget Flower')).not.toBeInTheDocument()
        expect(within(productSection).getByText('Premium Flower')).toBeInTheDocument()
    })

    it('filters out unavailable products when the availability toggle is enabled', async () => {
        renderHomePage()
        await selectCategory('Flower')

        const productSection = screen.getByRole('region', { name: /Our Premium Hemp Products/i })

        expect(await within(productSection).findByText('Unavailable Flower')).toBeInTheDocument()
        fireEvent.click(screen.getByLabelText(/Only show in-stock items/i))

        expect(within(productSection).queryByText('Unavailable Flower')).not.toBeInTheDocument()
        expect(within(productSection).getByText('Premium Flower')).toBeInTheDocument()
    })

    it('filters products by potency when the potency filter is enabled', async () => {
        renderHomePage()
        await selectCategory('Flower')

        const productSection = screen.getByRole('region', { name: /Our Premium Hemp Products/i })

        expect(await within(productSection).findByText('Budget Flower')).toBeInTheDocument()
        fireEvent.click(screen.getByLabelText(/Enable potency range filter/i))
        fireEvent.change(screen.getByLabelText(/Minimum potency/i), { target: { value: '26' } })
        fireEvent.change(screen.getByLabelText(/Maximum potency/i), { target: { value: '30' } })

        expect(within(productSection).queryByText('Budget Flower')).not.toBeInTheDocument()
        expect(within(productSection).getByText('Premium Flower')).toBeInTheDocument()
    })

    it('shows a friendly message when no products match the filters', async () => {
        renderHomePage()
        await selectCategory('Flower')

        const productSection = screen.getByRole('region', { name: /Our Premium Hemp Products/i })

        expect(await within(productSection).findByText('Budget Flower')).toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/Minimum price/i), { target: { value: '100' } })

        expect(
            within(productSection).getByText(
                'No products match your current filters. Try widening your search or selecting another category.'
            )
        ).toBeInTheDocument()
    })
})
