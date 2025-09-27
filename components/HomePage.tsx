'use client'
import { useEffect, useMemo } from 'react'
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

    useEffect(() => {
        applyAutoContrast()
    }, [productsByCategory])

    return (
        <>
            <Navigation products={products} />
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
                        {Object.entries(productsByCategory).map(([cat, list], sectionIndex) => (
                            <ProductSection
                                key={cat}
                                title={cat}
                                products={list as Product[]}
                                categoryId={slugify(cat)}
                                isFirstSection={sectionIndex === 0}
                            />
                        ))}
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
