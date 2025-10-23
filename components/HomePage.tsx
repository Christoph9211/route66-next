'use client'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import FooterNavigation from '@/components/FooterNavigation'
import QuickNavigation from '@/components/QuickNavigation'
import LocalSEOFAQ from '@/components/LocalSEOFAQ'
import LocationContent from '@/components/LocationContent'
import GoogleBusinessIntegration from '@/components/GoogleBusinessIntegration'
import { useKeyboardNavigation } from '@/hooks/useNavigation'
import { slugify } from '@/utils/slugify'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'

export default function HomePage() {
    useKeyboardNavigation()

    const productHighlights = [
        {
            title: 'Explore Our Full Menu',
            description: 'Browse every THCa product we carry, from premium flower to infused treats.',
            href: '/products',
            icon: 'fas fa-store',
        },
        {
            title: 'Fresh Flower Arrivals',
            description: 'Discover aromatic indoor flower with rotating strains sourced from trusted growers.',
            href: `/products/${slugify('Flower')}`,
            icon: 'fas fa-seedling',
        },
        {
            title: 'Vapes & Carts',
            description: 'Find smooth, flavorful disposables and cartridges ready for on-the-go relief.',
            href: `/products/${slugify('Vapes & Carts')}`,
            icon: 'fas fa-cloud',
        },
        {
            title: 'Edibles & Treats',
            description: 'Shop gummies, baked goods, and other delicious edibles with consistent dosing.',
            href: `/products/${slugify('Edibles')}`,
            icon: 'fas fa-cookie-bite',
        },
    ]

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
                        <h2 id="products-heading" className="mb-6 text-center text-4xl font-bold text-gray-900 dark:text-white">
                            Find Your Next Favorite Product
                        </h2>
                        <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600 dark:text-gray-300">
                            Shop the Route 66 Hemp menu to explore potent THCa flower, flavorful concentrates, and craveable edibles.
                            Jump straight into a featured category or view the entire lineup.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {productHighlights.map((highlight) => (
                                <Link
                                    key={highlight.href}
                                    href={highlight.href}
                                    className="focus-enhanced flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
                                >
                                    <div>
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                                            <i className={`${highlight.icon} text-xl`} aria-hidden="true" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                                            {highlight.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{highlight.description}</p>
                                    </div>
                                    <span className="mt-6 inline-flex items-center text-sm font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-300 dark:hover:text-green-200">
                                        View products
                                        <i className="fas fa-arrow-right ml-2 text-xs" aria-hidden="true" />
                                    </span>
                                </Link>
                            ))}
                        </div>
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
