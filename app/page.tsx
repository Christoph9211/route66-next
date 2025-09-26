import { Suspense } from 'react'
import StructuredData from '@/components/StructuredData'
import HomePageContent from '@/components/HomePage'
import fs from 'fs/promises'
import path from 'path'


export const dynamic = 'force-dynamic'

export default async function HomePage() {
    const file = await fs.readFile(
        path.join(process.cwd(), 'public', 'products', 'products.json'),
        'utf-8'
    )
    const products = JSON.parse(file)

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