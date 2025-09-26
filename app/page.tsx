import StructuredData from '@/components/StructuredData'
import HomePageContent from '@/components/HomePage'
import products from '@/public/products/products.json'

export const dynamic = 'force-static'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StructuredData />
            <HomePageContent products={products} />
        </div>
    )
}