'use client'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import Navigation from '@/components/Navigation'
import FooterNavigation from '@/components/FooterNavigation'
import QuickNavigation from '@/components/QuickNavigation'
import LocalSEOFAQ from '@/components/LocalSEOFAQ'
import LocationContent from '@/components/LocationContent'
import GoogleBusinessIntegration from '@/components/GoogleBusinessIntegration'
import { useKeyboardNavigation } from '@/hooks/useNavigation'
import { applyAutoContrast } from '@/utils/autoContrast'
import { slugify } from '@/utils/slugify'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import ProductSection from '@/components/ProductSection'
import { groupProductsByCategory, sortProductsByOrder } from '@/lib/products'
import type { ProductSortOrder } from '@/lib/products'
import type { Product } from '@/types/product'

type FilterState = {
    minPrice: string
    maxPrice: string
    onlyInStock: boolean
    potencyEnabled: boolean
    minPotency: number
    maxPotency: number
}

export default function HomePage({ products }: { products: Product[] }) {
    useKeyboardNavigation()

    const productsByCategory = useMemo(() => groupProductsByCategory(products), [products])
    const categoryEntries = useMemo(
        () =>
            Object.entries(productsByCategory).map(([name, list]) => ({
                name,
                slug: slugify(name),
                products: list as Product[],
            })),
        [productsByCategory]
    )
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('')
    const [sortOrder, setSortOrder] = useState<ProductSortOrder>('featured')
    const selectedCategory = useMemo(
        () =>
            categoryEntries.find((entry) => entry.slug === selectedCategorySlug) ??
            null,
        [categoryEntries, selectedCategorySlug]
    )
    const [filters, setFilters] = useState<FilterState>({
        minPrice: '',
        maxPrice: '',
        onlyInStock: false,
        potencyEnabled: false,
        minPotency: 0,
        maxPotency: 50,
    })

    const categoryPriceBounds = useMemo(() => {
        if (!selectedCategory) {
            return null
        }

        const priceValues = selectedCategory.products.flatMap((product) =>
            Object.values(product.prices ?? {})
                .map((value) => Number(value))
                .filter((value) => !Number.isNaN(value))
        )

        if (priceValues.length === 0) {
            return null
        }

        return {
            min: Math.min(...priceValues),
            max: Math.max(...priceValues),
        }
    }, [selectedCategory])

    const filteredProducts = useMemo(() => {
        if (!selectedCategory) {
            return [] as Product[]
        }

        const { minPrice, maxPrice, onlyInStock, potencyEnabled, minPotency, maxPotency } = filters
        const minPriceValue = minPrice !== '' ? Number(minPrice) : null
        const maxPriceValue = maxPrice !== '' ? Number(maxPrice) : null
        const minPotencyValue = potencyEnabled ? minPotency : null
        const maxPotencyValue = potencyEnabled ? maxPotency : null

        return selectedCategory.products.filter((product) => {
            const priceValues = Object.values(product.prices ?? {})
                .map((value) => Number(value))
                .filter((value) => !Number.isNaN(value))

            const matchesPrice =
                priceValues.length === 0 ||
                priceValues.some((price) => {
                    if (minPriceValue !== null && price < minPriceValue) {
                        return false
                    }
                    if (maxPriceValue !== null && price > maxPriceValue) {
                        return false
                    }
                    return true
                })

            if (!matchesPrice) {
                return false
            }

            if (onlyInStock) {
                if (typeof product.availability === 'boolean') {
                    if (!product.availability) {
                        return false
                    }
                } else if (product.availability && typeof product.availability === 'object') {
                    const availabilityValues = Object.values(product.availability)
                    const isAvailable =
                        availabilityValues.length === 0 || availabilityValues.some(Boolean)
                    if (!isAvailable) {
                        return false
                    }
                }
            }

            if (minPotencyValue !== null || maxPotencyValue !== null) {
                const potencyValue =
                    typeof product.thca_percentage === 'number'
                        ? product.thca_percentage
                        : null

                if (minPotencyValue !== null && (potencyValue === null || potencyValue < minPotencyValue)) {
                    return false
                }

                if (maxPotencyValue !== null && (potencyValue === null || potencyValue > maxPotencyValue)) {
                    return false
                }
            }

            return true
        })
    }, [filters, selectedCategory])

    const sortedProducts = useMemo(
        () => sortProductsByOrder(filteredProducts, sortOrder),
        [filteredProducts, sortOrder]
    )

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        const handleCategorySelect = (event: Event) => {
            const customEvent = event as CustomEvent<{
                categorySlug?: string
                categoryName?: string
            }>

            const slugFromEvent =
                customEvent.detail?.categorySlug ||
                (customEvent.detail?.categoryName
                    ? slugify(customEvent.detail.categoryName)
                    : undefined)

            if (!slugFromEvent) {
                return
            }

            const matchingCategory = categoryEntries.find(
                (entry) => entry.slug === slugFromEvent
            )

            if (matchingCategory) {
                setSelectedCategorySlug(matchingCategory.slug)
            }
        }

        window.addEventListener('products:select-category', handleCategorySelect)

        return () => {
            window.removeEventListener('products:select-category', handleCategorySelect)
        }
    }, [categoryEntries])

    useEffect(() => {
        if (selectedCategory) {
            applyAutoContrast()
        }
    }, [selectedCategory, sortedProducts])

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const slug = event.target.value

        setSelectedCategorySlug(slug)

        if (slug && typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('products:select-category', {
                    detail: { categorySlug: slug },
                })
            )
        }
    }

    const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value as ProductSortOrder)
    }

    const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setFilters((previous) => ({
            ...previous,
            minPrice: value,
        }))
    }

    const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setFilters((previous) => ({
            ...previous,
            maxPrice: value,
        }))
    }

    const handleInStockToggle = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target
        setFilters((previous) => ({
            ...previous,
            onlyInStock: checked,
        }))
    }

    const handlePotencyToggle = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target
        setFilters((previous) => ({
            ...previous,
            potencyEnabled: checked,
        }))
    }

    const handleMinPotencyChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = Number(event.target.value)
        setFilters((previous) => ({
            ...previous,
            minPotency: Math.min(nextValue, previous.maxPotency),
        }))
    }

    const handleMaxPotencyChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = Number(event.target.value)
        setFilters((previous) => ({
            ...previous,
            maxPotency: Math.max(nextValue, previous.minPotency),
        }))
    }

    const filtersDisabled = !selectedCategory

    return (
        <>
            <Navigation />
            <main id="main-content" role="main" tabIndex={-1} className="outline-none">
                <HeroSection />
                <section
                    id="products"
                    role="region"
                    aria-labelledby="products-heading"
                    tabIndex={-1}
                    data-section-nav
                    className="py-16 focus:outline-none"
                >
                    <div className="container mx-auto px-4">
                        <h2 id="products-heading" className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white">
                            Our Premium Hemp Products
                        </h2>
                        <div className="mx-auto mb-10 max-w-xl">
                            <label
                                htmlFor="product-category-select"
                                className="mb-2 block text-center text-lg font-semibold text-gray-800 dark:text-gray-200"
                            >
                                Select a category to view available products
                            </label>
                            <select
                                id="product-category-select"
                                value={selectedCategorySlug}
                                onChange={handleCategoryChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                aria-describedby="product-category-help"
                            >
                                <option value="">Choose a category</option>
                                {categoryEntries.map((entry) => (
                                    <option key={entry.slug} value={entry.slug}>
                                        {entry.name}
                                    </option>
                                ))}
                            </select>
                            <p
                                id="product-category-help"
                                className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300"
                            >
                                After choosing a category you can refine the list using the filters below.
                            </p>
                        </div>
                        <div className="mx-auto mb-12 max-w-4xl">
                            <div className="mb-8">
                                <label
                                    htmlFor="product-sort-select"
                                    className="mb-2 block text-center text-lg font-semibold text-gray-800 dark:text-gray-200"
                                >
                                    Sort products
                                </label>
                                <select
                                    id="product-sort-select"
                                    value={sortOrder}
                                    onChange={handleSortOrderChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    disabled={filtersDisabled}
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                            <fieldset className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <legend className="px-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                    Filter products
                                </legend>
                                <div className="mt-4 grid gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                            Price range
                                        </h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="price-min-input"
                                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                                >
                                                    Minimum price ($)
                                                </label>
                                                <input
                                                    id="price-min-input"
                                                    type="number"
                                                    min={0}
                                                    step={1}
                                                    value={filters.minPrice}
                                                    onChange={handleMinPriceChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                                    aria-describedby="price-filter-help"
                                                    disabled={filtersDisabled}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="price-max-input"
                                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                                >
                                                    Maximum price ($)
                                                </label>
                                                <input
                                                    id="price-max-input"
                                                    type="number"
                                                    min={0}
                                                    step={1}
                                                    value={filters.maxPrice}
                                                    onChange={handleMaxPriceChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                                    aria-describedby="price-filter-help"
                                                    disabled={filtersDisabled}
                                                />
                                            </div>
                                            <p
                                                id="price-filter-help"
                                                className="text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                {categoryPriceBounds
                                                    ? `Products in this category range from $${categoryPriceBounds.min.toFixed(
                                                          2
                                                      )} to $${categoryPriceBounds.max.toFixed(2)}.`
                                                    : 'Enter a minimum and maximum price to narrow the product list.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                                Availability
                                            </h3>
                                            <label className="mt-4 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    onChange={handleInStockToggle}
                                                    checked={filters.onlyInStock}
                                                    disabled={filtersDisabled}
                                                />
                                                Only show in-stock items
                                            </label>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                                Potency (THCa %)
                                            </h3>
                                            <div className="mt-2 space-y-4">
                                                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                        onChange={handlePotencyToggle}
                                                        checked={filters.potencyEnabled}
                                                        disabled={filtersDisabled}
                                                    />
                                                    Enable potency range filter
                                                </label>
                                                <div className="space-y-4" aria-disabled={!filters.potencyEnabled || filtersDisabled}>
                                                    <div>
                                                        <label
                                                            htmlFor="potency-min-input"
                                                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                                        >
                                                            Minimum potency: <span className="font-semibold">{filters.minPotency}%</span>
                                                        </label>
                                                        <input
                                                            id="potency-min-input"
                                                            type="range"
                                                            min={0}
                                                            max={50}
                                                            step={1}
                                                            value={filters.minPotency}
                                                            onChange={handleMinPotencyChange}
                                                            className="w-full"
                                                            disabled={filtersDisabled || !filters.potencyEnabled}
                                                            aria-valuetext={`${filters.minPotency}%`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="potency-max-input"
                                                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                                        >
                                                            Maximum potency: <span className="font-semibold">{filters.maxPotency}%</span>
                                                        </label>
                                                        <input
                                                            id="potency-max-input"
                                                            type="range"
                                                            min={0}
                                                            max={50}
                                                            step={1}
                                                            value={filters.maxPotency}
                                                            onChange={handleMaxPotencyChange}
                                                            className="w-full"
                                                            disabled={filtersDisabled || !filters.potencyEnabled}
                                                            aria-valuetext={`${filters.maxPotency}%`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        {selectedCategory ? (
                            <ProductSection
                                key={selectedCategory.slug}
                                title={selectedCategory.name}
                                products={sortedProducts}
                                categoryId={selectedCategory.slug}
                                isFirstSection
                                emptyMessage="No products match your current filters. Try widening your search or selecting another category."
                            />
                        ) : (
                            <p className="text-center text-lg text-gray-700 dark:text-gray-300">
                                Please choose a product category from the dropdown above to explore our selection.
                            </p>
                        )}
                    </div>
                </section>
                <AboutSection />
                <LocationContent />
                <ContactSection />
                <GoogleBusinessIntegration />
                <LocalSEOFAQ />
            </main>
            <FooterNavigation />
            <QuickNavigation />
        </>
    )
}
