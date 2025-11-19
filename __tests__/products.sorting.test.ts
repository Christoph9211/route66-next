import {
    getMinimumProductPrice,
    sortProductsByOrder,
    isProductAvailable,
} from '@/lib/products'
import type { Product } from '@/types/product'

describe('product sorting helpers', () => {
    const baseProduct: Product = {
        name: 'Base Product',
        category: 'Category',
        size_options: ['1g'],
        prices: { standard: 10 },
    }

    it('computes the minimum price across size options', () => {
        const product: Product = {
            ...baseProduct,
            name: 'Multi Size',
            prices: {
                eighth: 35,
                gram: 12,
                quarter: 60,
            },
        }

        expect(getMinimumProductPrice(product)).toBe(12)
    })

    it('returns null when no prices are available', () => {
        const product: Product = {
            ...baseProduct,
            name: 'No Price',
            prices: {},
        }

        expect(getMinimumProductPrice(product)).toBeNull()
    })

    it('sorts products by their minimum price in ascending order', () => {
        const products: Product[] = [
            {
                ...baseProduct,
                name: 'Premium',
                prices: {
                    eighth: 55,
                    gram: 20,
                },
            },
            {
                ...baseProduct,
                name: 'Budget',
                prices: {
                    gram: 10,
                    quarter: 35,
                },
            },
            {
                ...baseProduct,
                name: 'Standard',
                prices: {
                    gram: 15,
                    eighth: 40,
                },
            },
        ]

        const sorted = sortProductsByOrder(products, 'price-asc')

        expect(sorted.map((product) => product.name)).toEqual([
            'Budget',
            'Standard',
            'Premium',
        ])
    })

    it('sorts products by their minimum price in descending order', () => {
        const products: Product[] = [
            {
                ...baseProduct,
                name: 'Premium',
                prices: {
                    eighth: 55,
                    gram: 20,
                },
            },
            {
                ...baseProduct,
                name: 'Budget',
                prices: {
                    gram: 10,
                    quarter: 35,
                },
            },
            {
                ...baseProduct,
                name: 'Standard',
                prices: {
                    gram: 15,
                    eighth: 40,
                },
            },
        ]

        const sorted = sortProductsByOrder(products, 'price-desc')

        expect(sorted.map((product) => product.name)).toEqual([
            'Premium',
            'Standard',
            'Budget',
        ])
    })
})

describe('product availability helper', () => {
    const baseProduct: Product = {
        name: 'Availability Check',
        category: 'Category',
        size_options: ['1g'],
        prices: { standard: 10 },
    }

    it('returns false when the product banner marks it as out of stock', () => {
        expect(
            isProductAvailable({
                ...baseProduct,
                banner: 'Out of Stock',
            })
        ).toBe(false)
    })

    it('returns false when all availability entries are false', () => {
        expect(
            isProductAvailable({
                ...baseProduct,
                availability: {
                    small: false,
                    large: false,
                },
            })
        ).toBe(false)
    })

    it('returns true when at least one availability entry is true', () => {
        expect(
            isProductAvailable({
                ...baseProduct,
                availability: {
                    small: false,
                    large: true,
                },
            })
        ).toBe(true)
    })

    it('returns true when availability is not provided', () => {
        expect(isProductAvailable(baseProduct)).toBe(true)
    })
})
