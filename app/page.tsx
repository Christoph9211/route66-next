// app/page.tsx
import { Suspense } from 'react'
import StructuredData from '@/components/StructuredData'
import HomePageContent from '@/components/HomePage'
import { getProducts } from '@/lib/products.server'

export const revalidate = 3600 // Revalidate every hour

export const dynamic = 'force-static'

export default async function HomePage() {
    const products = await getProducts()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StructuredData />
            <Suspense
                fallback={
                    <div className="flex min-h-screen items-center justify-center">
                        <div className="leaf-loader animate-spin"></div>
                        <span className="ml-3 text-lg">Loading...</span>
                    </div>
                }
            >
                <HomePageContent products={products} />
            </Suspense>
        </div>
    )
}
