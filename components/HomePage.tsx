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
import { groupProductsByCategory } from '@/lib/products'
import type { Product } from '@/types/product'

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
    const selectedCategory = useMemo(
        () =>
            categoryEntries.find((entry) => entry.slug === selectedCategorySlug) ??
            null,
        [categoryEntries, selectedCategorySlug]
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
    }, [selectedCategory])

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
                                className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
                            >
                                Product details load once a category is selected to keep the page fast.
                            </p>
                        </div>
                        {selectedCategory ? (
                            <ProductSection
                                key={selectedCategory.slug}
                                title={selectedCategory.name}
                                products={selectedCategory.products}
                                categoryId={selectedCategory.slug}
                                isFirstSection
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
