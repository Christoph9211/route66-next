'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import Navigation from '@/components/Navigation'
import FooterNavigation from '@/components/FooterNavigation'
import QuickNavigation from '@/components/QuickNavigation'
import LocalSEOFAQ from '@/components/LocalSEOFAQ'
import LocationContent from '@/components/LocationContent'
import GoogleBusinessIntegration from '@/components/GoogleBusinessIntegration'
import { useKeyboardNavigation } from '@/hooks/useNavigation'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import HeroSection from '@/components/HeroSection'
import ProductSection from '@/components/ProductSection'
import ProductCarousel from '@/components/ProductCarousel'
import MarketingHighlights from '@/components/MarketingHighlights'
import FilterPanel, { type FilterState } from '@/components/FilterPanel'
import {
    buildCuratedCollections,
    groupProductsByCategory,
    sortProductsByOrder,
} from '@/lib/products'
import type { ProductSortOrder } from '@/lib/products'
import { MARKETING_BLOCKS } from '@/lib/marketing'
import { applyAutoContrast } from '@/utils/autoContrast'
import { slugify } from '@/utils/slugify'
import type { Product } from '@/types/product'

interface HomePageProps {
    products: Product[]
    initialCategory?: string
}

interface CategoryEntry {
    name: string
    slug: string
    products: Product[]
}

export default function HomePage({ products, initialCategory }: HomePageProps) {
    useKeyboardNavigation()

    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategory ?? '')
    const [sortOrder, setSortOrder] = useState<ProductSortOrder>('featured')
    const [filters, setFilters] = useState<FilterState>({
        minPrice: '',
        maxPrice: '',
        onlyInStock: false,
        potencyEnabled: false,
        minPotency: 0,
        maxPotency: 50,
    })
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

    const productsByCategory = useMemo(() => groupProductsByCategory(products), [products])

    const curatedCollections = useMemo(() => buildCuratedCollections(products, 10), [products])
    const { featured, newArrivals, bestsellers } = curatedCollections

    const categoryEntries = useMemo<CategoryEntry[]>(
        () =>
            Object.entries(productsByCategory).map(([name, list]) => ({
                name,
                slug: slugify(name),
                products: list as Product[],
            })),
        [productsByCategory]
    )

    const selectedCategory = useMemo(() => {
        const explicitSelection = categoryEntries.find((entry) => entry.slug === selectedCategorySlug)

        if (explicitSelection) {
            return explicitSelection
        }

        return categoryEntries[0] ?? null
    }, [categoryEntries, selectedCategorySlug])

    const activeCategorySlug = selectedCategory?.slug ?? ''

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
                    const isAvailable = availabilityValues.length === 0 || availabilityValues.some(Boolean)
                    if (!isAvailable) {
                        return false
                    }
                }
            }

            if (minPotencyValue !== null || maxPotencyValue !== null) {
                const potencyValue =
                    typeof product.thca_percentage === 'number' ? product.thca_percentage : null

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

    const filtersDisabled = !selectedCategory
    const hasCategories = categoryEntries.length > 0

    const scrollToCategory = useCallback((slug: string) => {
        if (typeof window === 'undefined') {
            return
        }

        const categorySection = document.getElementById(slug)
        if (categorySection) {
            if (typeof categorySection.scrollIntoView === 'function') {
                categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            return
        }

        const productsSection = document.getElementById('products')
        if (productsSection && typeof productsSection.scrollIntoView === 'function') {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [])

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

            const matchingCategory = categoryEntries.find((entry) => entry.slug === slugFromEvent)

            if (matchingCategory) {
                setSelectedCategorySlug(matchingCategory.slug)
                requestAnimationFrame(() => {
                    scrollToCategory(matchingCategory.slug)
                })
            }
        }

        window.addEventListener('products:select-category', handleCategorySelect)

        return () => {
            window.removeEventListener('products:select-category', handleCategorySelect)
        }
    }, [categoryEntries, scrollToCategory])

    useEffect(() => {
        if (selectedCategory) {
            applyAutoContrast()
        }
    }, [selectedCategory, sortedProducts])

    useEffect(() => {
        if (typeof document === 'undefined') {
            return
        }

        const { body } = document
        if (!body) {
            return
        }

        if (isFilterDrawerOpen) {
            body.style.overflow = 'hidden'
        } else {
            body.style.overflow = ''
        }

        return () => {
            body.style.overflow = ''
        }
    }, [isFilterDrawerOpen])

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

    const handleCategoryTabSelect = (slug: string) => {
        setSelectedCategorySlug(slug)

        if (slug && typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('products:select-category', {
                    detail: { categorySlug: slug },
                })
            )
        }
    }

    const closeFilterDrawer = () => {
        setIsFilterDrawerOpen(false)
    }

    const filterPanelProps = {
        sortOrder,
        onSortOrderChange: handleSortOrderChange,
        filters,
        onMinPriceChange: handleMinPriceChange,
        onMaxPriceChange: handleMaxPriceChange,
        onInStockToggle: handleInStockToggle,
        onPotencyToggle: handlePotencyToggle,
        onMinPotencyChange: handleMinPotencyChange,
        onMaxPotencyChange: handleMaxPotencyChange,
        filtersDisabled,
        categoryPriceBounds,
    }

    return (
        <>
            <Navigation />
            <main id="main-content" role="main" tabIndex={-1} className="outline-none">
                <HeroSection />
                {featured.length > 0 ? (
                    <ProductCarousel
                        title="Featured Favorites"
                        description="Hand-picked strains and goods our team can't stop talking about."
                        sectionId="featured-products"
                        products={featured}
                        cta={{ label: 'Browse full menu', href: '#products' }}
                    />
                ) : null}
                {newArrivals.length > 0 ? (
                    <ProductCarousel
                        title="Fresh on the Shelf"
                        description="Discover the latest drops before they disappear."
                        sectionId="new-arrivals"
                        products={newArrivals}
                    />
                ) : null}
                <section
                    id="products"
                    role="region"
                    aria-labelledby="products-heading"
                    tabIndex={-1}
                    data-section-nav
                    className="py-16 focus:outline-none"
                >
                    <div className="container mx-auto px-4">
                        <h2
                            id="products-heading"
                            className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white"
                        >
                            Our Premium Hemp Products
                        </h2>
                        {hasCategories ? (
                            <div className="lg:grid lg:grid-cols-[320px_1fr] lg:items-start lg:gap-8">
                                <div className="hidden lg:block">
                                    <FilterPanel {...filterPanelProps} />
                                </div>
                                <div>
                                    <div className="mx-auto mb-10 max-w-4xl">
                                        <p className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                                            Select a category to view available products
                                        </p>
                                        <div
                                            id="product-category-tabs"
                                            role="tablist"
                                            aria-label="Product categories"
                                            className="flex flex-wrap justify-center gap-3"
                                        >
                                            {categoryEntries.map((entry) => {
                                                const isActive = entry.slug === activeCategorySlug
                                                const baseClasses =
                                                    'focus-enhanced rounded-full border px-5 py-2 text-sm font-semibold transition-colors'
                                                const activeClasses =
                                                    'border-green-600 bg-green-600 text-white shadow-lg'
                                                const inactiveClasses =
                                                    'border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:text-green-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-green-400'

                                                return (
                                                    <button
                                                        key={entry.slug}
                                                        type="button"
                                                        role="tab"
                                                        id={`${entry.slug}-tab`}
                                                        data-category-tab={entry.slug}
                                                        aria-controls={entry.slug}
                                                        aria-selected={isActive}
                                                        tabIndex={isActive ? 0 : -1}
                                                        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                                        onClick={() => handleCategoryTabSelect(entry.slug)}
                                                    >
                                                        {entry.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <p
                                            id="product-category-help"
                                            className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300"
                                        >
                                            After choosing a category you can refine the list using the filters below.
                                        </p>
                                    </div>
                                    <div className="mb-8 flex items-center justify-between lg:hidden">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                                        <button
                                            type="button"
                                            className="focus-enhanced inline-flex items-center gap-2 rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-600 hover:text-white dark:text-green-300"
                                            onClick={() => setIsFilterDrawerOpen(true)}
                                            aria-haspopup="dialog"
                                            aria-expanded={isFilterDrawerOpen}
                                            aria-controls="mobile-filter-drawer"
                                        >
                                            Open filters
                                        </button>
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
                                            Please choose a product category from the options above to explore our selection.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-lg text-gray-700 dark:text-gray-300">
                                We couldn&apos;t find any products to display right now. Please check back later for new arrivals.
                            </p>
                        )}
                    </div>
                </section>
                <MarketingHighlights blocks={MARKETING_BLOCKS} />
                {bestsellers.length > 0 ? (
                    <ProductCarousel
                        title="Route 66 Bestsellers"
                        description="Fan-favorite picks with unbeatable value and consistency."
                        sectionId="bestsellers"
                        products={bestsellers}
                        cta={{ label: 'Shop top sellers', href: '#products' }}
                    />
                ) : null}
                <AboutSection />
                <LocationContent />
                <ContactSection />
                <GoogleBusinessIntegration />
                <LocalSEOFAQ />
            </main>
            <FooterNavigation />
            <QuickNavigation />

            {isFilterDrawerOpen ? (
                <div
                    id="mobile-filter-drawer"
                    className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-filter-heading"
                >
                    <button
                        type="button"
                        className="flex-1"
                        aria-hidden="true"
                        tabIndex={-1}
                        onClick={closeFilterDrawer}
                    />
                    <div className="max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 id="mobile-filter-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Filter products
                            </h2>
                            <button
                                type="button"
                                onClick={closeFilterDrawer}
                                className="focus-enhanced rounded-full border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                Close
                            </button>
                        </div>
                        <FilterPanel
                            {...filterPanelProps}
                            className="space-y-6"
                            headingId="mobile-filter-heading"
                            isSticky={false}
                        />
                    </div>
                </div>
            ) : null}
        </>
    )
}
