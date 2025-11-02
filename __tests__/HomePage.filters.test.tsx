import { fireEvent, render, screen } from '@testing-library/react'
import type { Product } from '@/types/product'
import HomePage from '@/components/HomePage'

jest.mock('@/hooks/useNavigation', () => ({
    useKeyboardNavigation: jest.fn(),
}))

jest.mock('@/utils/autoContrast', () => ({
    applyAutoContrast: jest.fn(),
}))

jest.mock('@/components/Navigation', () => () => <nav data-testid="navigation" />)
jest.mock('@/components/FooterNavigation', () => () => <footer data-testid="footer" />)
jest.mock('@/components/QuickNavigation', () => () => <div data-testid="quick-nav" />)
jest.mock('@/components/LocalSEOFAQ', () => () => <section data-testid="faq" />)
jest.mock('@/components/LocationContent', () => () => <section data-testid="location" />)
jest.mock('@/components/GoogleBusinessIntegration', () => () => <section data-testid="google" />)
jest.mock('@/components/HeroSection', () => () => <section data-testid="hero" />)
jest.mock('@/components/AboutSection', () => () => <section data-testid="about" />)
jest.mock('@/components/ContactSection', () => () => <section data-testid="contact" />)

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

const selectCategory = (value: string) => {
    const selectElement = screen.getByLabelText(/Select a category/i)
    fireEvent.change(selectElement, { target: { value } })
}

describe('HomePage filters', () => {
    it('filters products by price range', async () => {
        renderHomePage()
        selectCategory('flower')

        expect(await screen.findByText('Budget Flower')).toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/Minimum price/i), { target: { value: '30' } })

        expect(screen.queryByText('Budget Flower')).not.toBeInTheDocument()
        expect(screen.getByText('Premium Flower')).toBeInTheDocument()
    })

    it('filters out unavailable products when the availability toggle is enabled', async () => {
        renderHomePage()
        selectCategory('flower')

        expect(await screen.findByText('Unavailable Flower')).toBeInTheDocument()
        fireEvent.click(screen.getByLabelText(/Only show in-stock items/i))

        expect(screen.queryByText('Unavailable Flower')).not.toBeInTheDocument()
        expect(screen.getByText('Premium Flower')).toBeInTheDocument()
    })

    it('filters products by potency when the potency filter is enabled', async () => {
        renderHomePage()
        selectCategory('flower')

        expect(await screen.findByText('Budget Flower')).toBeInTheDocument()
        fireEvent.click(screen.getByLabelText(/Enable potency range filter/i))
        fireEvent.change(screen.getByLabelText(/Minimum potency/i), { target: { value: '26' } })
        fireEvent.change(screen.getByLabelText(/Maximum potency/i), { target: { value: '30' } })

        expect(screen.queryByText('Budget Flower')).not.toBeInTheDocument()
        expect(screen.getByText('Premium Flower')).toBeInTheDocument()
    })

    it('shows a friendly message when no products match the filters', async () => {
        renderHomePage()
        selectCategory('flower')

        expect(await screen.findByText('Budget Flower')).toBeInTheDocument()
        fireEvent.change(screen.getByLabelText(/Minimum price/i), { target: { value: '100' } })

        expect(
            screen.getByText(
                'No products match your current filters. Try widening your search or selecting another category.'
            )
        ).toBeInTheDocument()
    })
})
