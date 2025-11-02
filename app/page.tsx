// app/page.tsx
import { Suspense } from 'react'
import StructuredData from '@/components/StructuredData'
import HomePageContent from '@/components/HomePage'
import ProductDiscovery from '@/components/ProductDiscovery'
import { getProducts } from '@/lib/products.server'
import { groupProductsByCategory } from '@/lib/products'
import { slugify } from '@/utils/slugify'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
    const products = await getProducts()
    const groupedProducts = groupProductsByCategory(products)
    const [firstCategoryName] = Object.keys(groupedProducts)
    const initialCategory = firstCategoryName ? slugify(firstCategoryName) : undefined

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StructuredData />
            <Suspense
                fallback={
                    <ProductDiscovery
                        products={products}
                        initialCategory={initialCategory}
                    />
                }
            >
                <HomePageContent products={products} initialCategory={initialCategory} />
            </Suspense>
        </div>
    )
}
