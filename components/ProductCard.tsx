'use client'
import { useState, useEffect } from 'react'
import { slugify } from '@/utils/slugify'

interface Product {
    name: string
    category: string
    size_options: string[]
    prices: Record<string, number>
    thca_percentage?: number
    banner?: string
    availability?: Record<string, boolean>
}

export default function ProductCard({ product }: { product: Product }) {
    const [selectedSize, setSelectedSize] = useState(product.size_options[0])
    const [isAvailable, setIsAvailable] = useState(true)

    useEffect(() => {
        if (product.availability && typeof product.availability === 'object') {
            setIsAvailable(product.availability[selectedSize] !== false)
        }
    }, [selectedSize, product.availability])

    const currentPrice = product.prices[selectedSize]
    const isOutOfStock = product.banner === 'Out of Stock' || !isAvailable
    const selectId = `size-${slugify(product.name)}`

    return (
        <div className={`product-card relative min-w-[285px] rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 dark:bg-gray-800 ${isOutOfStock ? 'opacity-75' : ''}`}>            
            {product.banner && (
                <div className={`product-banner auto-contrast ${
                    product.banner === 'New' ? 'bg-green-600 text-white' :
                    product.banner === 'Out of Stock' ? 'bg-red-600 text-white' :
                    'bg-blue-600 text-white'}`}>{product.banner}</div>
            )}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{product.category || 'N/A'}</p>
                {product.thca_percentage ? (
                    <p className="text-sm font-medium text-green-600">THCa: {product.thca_percentage}%</p>
                ) : (
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">N/A</p>
                )}
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
            <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-green-600">${currentPrice?.toFixed(2) || 'N/A'}</div>
                <button
                    className={`add-to-cart rounded-md px-4 py-2 ${isOutOfStock ? 'cursor-not-allowed bg-white text-black hover:text-red-600' : 'bg-emerald-700 text-white hover:bg-white hover:text-green-600 focus:outline-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-emerald-600 active:text-white'}`}
                    disabled={isOutOfStock}
                    aria-label={isOutOfStock ? `Out of Stock ${product.name}` : `Add to Cart ${product.name}`}
                    data-product-id={slugify(product.name)}
                    data-variant-id={`${slugify(product.name)}_${slugify(selectedSize)}`}
                    data-name={product.name}
                    data-price={currentPrice?.toFixed(2) || 0}
                    data-currency="USD"
                    data-image=""
                    data-available={!isOutOfStock}
                >
                    <span className="text-lg font-bold">{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
            </div>
        </div>
    )
}
