'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { slugify } from '@/utils/slugify'
import type { Product } from '@/types/product'

interface ProductCardProps {
    product: Product
    priority?: boolean
    gridIndex?: number
    gridSize?: number
    parentHeadingId?: string
}

export default function ProductCard({ product, priority = false, gridIndex, gridSize, parentHeadingId }: ProductCardProps) {
    const [selectedSize, setSelectedSize] = useState(product.size_options[0])
    const [isAvailable, setIsAvailable] = useState(true)

    useEffect(() => {
        if (product.availability && typeof product.availability === 'object') {
            setIsAvailable(product.availability[selectedSize] !== false)
        }
    }, [selectedSize, product.availability])

    const currentPrice = product.prices[selectedSize]
    const isOutOfStock = product.banner === 'Out of Stock' || !isAvailable
    const selectId = ['size', slugify(product.name)].join('-')
    const cardId = ['product', slugify(product.name)].join('-')
    const titleId = [cardId, 'title'].join('-')
    const categoryId = [cardId, 'category'].join('-')
    const priceId = [cardId, 'price'].join('-')
    const availabilityId = [cardId, 'availability'].join('-')
    const posInSet = typeof gridIndex === 'number' ? gridIndex + 1 : undefined
    const setSize = typeof gridSize === 'number' ? gridSize : undefined
    const availabilityLabel = isOutOfStock ? 'Currently unavailable' : 'Available'
    const priceLabel = typeof currentPrice === 'number' ? '$' + currentPrice.toFixed(2) : 'N/A'
    const describedByIds = [categoryId, availabilityId, priceId]
    if (parentHeadingId) {
        describedByIds.unshift(parentHeadingId)
    }
    const describedBy = describedByIds.join(' ')
    const showProductImage = false // Toggle when real product photography is available

    return (
        <article
            id={cardId}
            className={`product-card relative flex h-full w-full flex-col sm:w-fit sm:min-w-[285px] rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800 focus-enhanced ${isOutOfStock ? 'opacity-75' : ''}`}
            tabIndex={0}
            data-product-card="true"
            data-grid-index={typeof gridIndex === 'number' ? gridIndex : undefined}
            aria-labelledby={titleId}
            aria-describedby={describedBy}
            aria-posinset={posInSet}
            aria-setsize={setSize}
        >
            {product.banner && (
                <div
                    className={`product-banner ${
                        product.banner === 'New'
                            ? 'bg-green-700 text-white'
                            : product.banner === 'Out of Stock'
                                ? 'bg-red-700 text-white'
                                : 'bg-blue-700 text-white'
                    }`}
                >
                    {product.banner}
                </div>
            )}
            <div className="mb-4">
                {showProductImage ? (
                    <Image
                        src="/assets/images/placeholder.webp"
                        alt={product.name}
                        width={400}
                        height={300}
                        priority={priority}
                        className="h-48 w-full rounded object-cover"
                    />
                ) : (
                    <div className="flex h-48 w-full items-center justify-center rounded border border-dashed border-gray-200 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:text-gray-300">
                        <span>Product imagery coming soon</span>
                    </div>
                )}
            </div>
            <div className="mb-4 flex-1">
                <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                <p id={categoryId} className="text-sm text-gray-600 dark:text-gray-300">{product.category || 'N/A'}</p>
                {product.thca_percentage ? (
                    <p className="text-sm font-medium text-green-600">THCa: {product.thca_percentage}%</p>
                ) : (
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">N/A</p>
                )}
                <p id={availabilityId} className="text-sm text-gray-600 dark:text-gray-300">{availabilityLabel}</p>
            </div>
            <div className="mb-4">
                <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Size:</label>
                {product.size_options.length > 1 ? (
                    <select
                        id={selectId}
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        disabled={isOutOfStock}
                    >
                        {product.size_options.map((size: string) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                ) : (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{selectedSize || 'N/A'}</span>
                )}
            </div>
            <div className="mt-auto flex items-center justify-center pt-4">
                <div id={priceId} className="text-xl font-bold text-green-600">{priceLabel}</div>
            </div>
        </article>
    )
}
