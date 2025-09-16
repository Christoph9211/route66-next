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
            <div className="wrapper">
                <h2 className="fluid-heading mb-8 text-center font-bold text-gray-900 dark:text-white">{title}</h2>
                <div className="responsive-grid gap-6">
                    {products.map((product, index) => (
                        <ProductCard key={product.name} product={product} priority={isFirstSection && index === 0} />
                    ))}
                </div>
            </div>
        </section>
    )
}        
