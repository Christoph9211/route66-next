'use client';
import { useEffect, useState } from 'react'
import StructuredData from '@/components/StructuredData'
import Navigation from '@/components/Navigation'
import FooterNavigation from '@/components/FooterNavigation'
import QuickNavigation from '@/components/QuickNavigation'
import LocalSEOFAQ from '@/components/LocalSEOFAQ'
import LocationContent from '@/components/LocationContent'
import GoogleBusinessIntegration from '@/components/GoogleBusinessIntegration'
import CartDrawer from '@/components/CartDrawer'
import CartPage from '@/components/CartPage'
import { useNavigation, useKeyboardNavigation } from '@/hooks/useNavigation'
import { applyAutoContrast } from '@/utils/autoContrast'
import { initCartButtonListener } from '@/utils/cartEvents'
import { slugify } from '@/utils/slugify'
import { CartProvider } from '@/hooks/useCart'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import ProductSection from '@/components/ProductSection'

export default function HomePage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { activeSection } = useNavigation()
    useKeyboardNavigation()

    useEffect(() => {
        fetch('/products/products.json')
            .then(res => res.json() as Promise<any[]>)
            .then((data) => setProducts(data))
            .catch(err => {
                setError('Failed to load products')
                console.error(err)
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        initCartButtonListener()
    }, [])

    useEffect(() => {
        applyAutoContrast()
    }, [products])

    const productsByCategory = products.reduce((acc: any, product: any) => {
        const cat = product.category || 'Uncategorized'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(product)
        return acc
    }, {})

    Object.keys(productsByCategory).forEach(cat => {
        productsByCategory[cat].sort((a: any, b: any) => {
            const rank = (p: any) =>
                p.banner === 'New' ? 0 : p.banner === 'Out of Stock' ? 2 : 1
            return rank(a) - rank(b) || a.name.localeCompare(b.name)
        })
    })

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="leaf-loader animate-spin"></div>
                <span className="ml-3 text-lg">Loading products...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="mt-2 text-gray-700">{error}</p>
                    <button
                        onClick={() => location.reload()}
                        className="mt-4 rounded bg-green-600 px-4 py-2 text-white"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <StructuredData />
                <Navigation products={products} />
                <main>
                    <HeroSection />
                    <section id="products" className="py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white">
                                Our Premium Hemp Products
                            </h2>
                            {Object.entries(productsByCategory).map(([cat, list]) => (
                                <ProductSection
                                    key={cat}
                                    title={cat}
                                    products={list as any[]}
                                    categoryId={slugify(cat)}
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
                <CartDrawer />
                <CartPage />
            </div>
        </CartProvider>
    )
}
