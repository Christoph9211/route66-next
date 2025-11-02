import ProductCard from './ProductCard'
import type { Product } from '@/types/product'

interface ProductSectionProps {
    title: string
    products: Product[]
    categoryId: string
    isFirstSection?: boolean
    emptyMessage?: string
}

export default function ProductSection({
    title,
    products,
    categoryId,
    isFirstSection = false,
    emptyMessage = 'No products available in this category at the moment.',
}: ProductSectionProps) {
    const hasProducts = Array.isArray(products) && products.length > 0
    const headingId = [categoryId, 'heading'].join('-')
    const totalItems = hasProducts ? products.length : 0

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
                {hasProducts ? (
                    <ul
                        className="grid list-none grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:justify-items-start"
                        role="list"
                        aria-labelledby={headingId}
                        data-product-grid
                    >
                        {products.map((product, index) => (
                            <li key={product.name} className="list-none h-full">
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
                ) : (
                    <p className="text-center text-lg text-gray-700 dark:text-gray-300" role="status">
                        {emptyMessage}
                    </p>
                )}
            </div>
        </section>
    )
}
