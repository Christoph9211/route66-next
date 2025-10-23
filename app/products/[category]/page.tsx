import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import FooterNavigation from '@/components/FooterNavigation'
import QuickNavigation from '@/components/QuickNavigation'
import HeroSection from '@/components/HeroSection'
import LocationContent from '@/components/LocationContent'
import ContactSection from '@/components/ContactSection'
import GoogleBusinessIntegration from '@/components/GoogleBusinessIntegration'
import LocalSEOFAQ from '@/components/LocalSEOFAQ'
import ProductSection from '@/components/ProductSection'
import { getProductCategories, getProductsByCategory } from '@/lib/products.server'

export const revalidate = 3600

type CategoryPageParams = {
    params: {
        category: string
    }
}

export async function generateStaticParams() {
    const categories = await getProductCategories()
    return categories.map((category) => ({ category: category.slug }))
}

export default async function ProductCategoryPage({ params }: CategoryPageParams) {
    const categoryData = await getProductsByCategory(params.category)

    if (!categoryData) {
        notFound()
    }

    const { categoryName, products } = categoryData

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main id="main-content" role="main" tabIndex={-1} className="outline-none">
                <HeroSection />
                <section className="py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{categoryName}</h1>
                        <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
                            Explore our latest {categoryName.toLowerCase()} inventory, complete with pricing, available sizes, and product highlights.
                        </p>
                    </div>
                </section>
                <ProductSection
                    title={categoryName}
                    products={products}
                    categoryId={params.category}
                    isFirstSection
                />
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
