import ProductCard from './ProductCard'

interface Product {
    name: string
    category: string
    size_options: string[]
    prices: Record<string, number>
    thca_percentage?: number
    banner?: string
    availability?: Record<string, boolean>
}

export default function ProductSection({ title, products, categoryId, isFirstSection = false }: { title: string, products: Product[], categoryId: string, isFirstSection?: boolean }) {
    if (!products || products.length === 0) return null

    return (
        <section id={categoryId} className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product, index) => (
                        <ProductCard key={product.name} product={product} priority={isFirstSection && index === 0} />
                    ))}
                </div>
            </div>
        </section>
    )
}        
