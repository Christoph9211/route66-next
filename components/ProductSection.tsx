
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

interface ProductSectionProps {
    title: string
    products: Product[]
    categoryId: string
    isFirstSection?: boolean
}

export default function ProductSection({ title, products, categoryId, isFirstSection = false }: ProductSectionProps) {
    if (!products || products.length === 0) return null

    const headingId = [categoryId, 'heading'].join('-')
    const totalItems = products.length

    return (
        <section
            id={categoryId}
            role="region"
            aria-labelledby={headingId}
            tabIndex={-1}
            data-section-nav
            className="py-12 focus:outline-none"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2
                    id={headingId}
                    className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white"
                >
                    {title}
                </h2>
                <ul
                    className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    role="list"
                    aria-labelledby={headingId}
                    data-product-grid
                >
                    {products.map((product, index) => (
                        <li key={product.name} className="list-none">
                            <ProductCard
                                product={product}
                                priority={isFirstSection && index === 0}
                                gridIndex={index}
                                gridSize={totalItems}
                                parentHeadingId={headingId}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
