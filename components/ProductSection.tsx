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
        <section id={categoryId} className="py-12" tabIndex={-1}>
            <div className="wrapper">
                <h2 
                    className="fluid-heading mb-8 text-center font-bold text-gray-900 dark:text-white"
                    id={`${categoryId}-heading`}
                >
                    {title}
                </h2>
                <div 
                    className="responsive-grid gap-6 product-grid"
                    role="grid"
                    aria-labelledby={`${categoryId}-heading`}
                >
                    {products.map((product, index) => (
                        <div key={product.name} role="gridcell">
                            <ProductCard product={product} priority={isFirstSection && index === 0} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}        
