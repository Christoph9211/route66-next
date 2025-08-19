import ProductCard from './ProductCard'
import { slugify } from '@/utils/slugify'

export default function ProductSection({ title, products, categoryId }: { title: string, products: any[], categoryId: string }) {
    if (!products || products.length === 0) return null

    return (
        <section id={categoryId} className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map(product => (
                        <ProductCard key={product.name} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}        