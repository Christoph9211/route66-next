import Link from 'next/link'
import Navigation from '@/components/Navigation'
import FooterNavigation from '@/components/FooterNavigation'
import QuickNavigation from '@/components/QuickNavigation'
import HeroSection from '@/components/HeroSection'
import LocationContent from '@/components/LocationContent'
import ContactSection from '@/components/ContactSection'
import GoogleBusinessIntegration from '@/components/GoogleBusinessIntegration'
import LocalSEOFAQ from '@/components/LocalSEOFAQ'
import { getProductCategories } from '@/lib/products.server'

export const revalidate = 3600

const CATEGORY_ICONS: Record<string, string> = {
    Flower: 'fas fa-seedling',
    Concentrates: 'fas fa-bong',
    'Diamonds & Sauce': 'fas fa-gem',
    'Vapes & Carts': 'fas fa-cloud',
    Edibles: 'fas fa-cookie-bite',
    'Pre-Rolls': 'fas fa-smoking',
}

export default async function ProductsPage() {
    const categories = await getProductCategories()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main id="main-content" role="main" tabIndex={-1} className="outline-none">
                <HeroSection />
                <section
                    id="products"
                    role="region"
                    aria-labelledby="product-categories-heading"
                    tabIndex={-1}
                    data-section-nav
                    className="py-16"
                >
                    <div className="container mx-auto px-4">
                        <h1 id="product-categories-heading" className="mb-6 text-center text-4xl font-bold text-gray-900 dark:text-white">
                            Shop by Category
                        </h1>
                        <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600 dark:text-gray-300">
                            Explore our curated THCa selection and jump directly into the product category that fits your vibe. Each section leads to live inventory with detailed sizing, pricing, and availability.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {categories.map((category) => {
                                const icon = CATEGORY_ICONS[category.name] ?? 'fas fa-box-open'
                                return (
                                    <Link
                                        key={category.slug}
                                        href={`/products/${category.slug}`}
                                        className="focus-enhanced flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
                                    >
                                        <div>
                                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                                                <i className={`${icon} text-xl`} aria-hidden="true" />
                                            </div>
                                            <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">{category.name}</h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                View all available {category.name.toLowerCase()} offerings, including size options and pricing updated hourly.
                                            </p>
                                        </div>
                                        <span className="mt-6 inline-flex items-center text-sm font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-300 dark:hover:text-green-200">
                                            Browse {category.name}
                                            <i className="fas fa-arrow-right ml-2 text-xs" aria-hidden="true" />
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>
                <LocationContent />
                <ContactSection />
                <GoogleBusinessIntegration />
                <LocalSEOFAQ />
            </main>
            <FooterNavigation />
            <QuickNavigation />
        </div>
    )
}
