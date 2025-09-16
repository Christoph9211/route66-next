'use client'
import { useEffect } from 'react'
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

interface Product {
    name: string
    category: string
    size_options: string[]
    prices: Record<string, number>
    thca_percentage?: number
    banner?: string
    availability?: Record<string, boolean>
}

export default function HomePage({ products }: { products: Product[] }) {
    useKeyboardNavigation()

    useEffect(() => {
        applyAutoContrast()
    }, [products])

    const productsByCategory = products.reduce((acc: Record<string, Product[]>, product: Product) => {
        const cat = product.category || 'Uncategorized'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(product)
        return acc
    }, {})

    Object.keys(productsByCategory).forEach(cat => {
        productsByCategory[cat].sort((a: Product, b: Product) => {
            const rank = (p: Product) =>
                p.banner === 'New' ? 0 : p.banner === 'Out of Stock' ? 2 : 1
            return rank(a) - rank(b) || a.name.localeCompare(b.name)
        })
    })

    return (
        <>
            <Navigation products={products} />
            <main className="safe-area-bottom">
                <HeroSection />
                <section id="products" className="py-16">
                    <div className="wrapper">
                        <h2 className="fluid-heading mb-12 text-center font-bold text-gray-900 dark:text-white">
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
