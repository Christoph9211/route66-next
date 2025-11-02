'use client'

import Navigation from '@/components/Navigation'
import FooterNavigation from '@/components/FooterNavigation'
import QuickNavigation from '@/components/QuickNavigation'
import LocalSEOFAQ from '@/components/LocalSEOFAQ'
import LocationContent from '@/components/LocationContent'
import GoogleBusinessIntegration from '@/components/GoogleBusinessIntegration'
import { useKeyboardNavigation } from '@/hooks/useNavigation'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import ProductDiscovery from '@/components/ProductDiscovery'
import type { Product } from '@/types/product'

interface HomePageProps {
    products: Product[]
    initialCategory?: string
}

export default function HomePage({ products, initialCategory }: HomePageProps) {
    useKeyboardNavigation()

    return (
        <>
            <Navigation />
            <main id="main-content" role="main" tabIndex={-1} className="outline-none">
                <ProductDiscovery products={products} initialCategory={initialCategory} />
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
