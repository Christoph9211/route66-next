'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
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

export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
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
        <div 
            className={`product-card relative w-full rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800 ${isOutOfStock ? 'opacity-75' : ''}`}
            tabIndex={0}
            role="article"
            aria-labelledby={`product-title-${slugify(product.name)}`}
            data-keyboard-clickable
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
            <Image
                src="/assets/images/placeholder.webp"
                alt={product.name}
                width={400}
                height={300}
                priority={priority}
                className="mb-4 h-48 w-full rounded object-cover"
            />
            <div className="mb-4">
                <h3 
                    id={`product-title-${slugify(product.name)}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                    {product.name}
                </h3>
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
                        className="focus-enhanced w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        disabled={isOutOfStock}
                        aria-describedby={`price-${slugify(product.name)}`}
                    >
                        {product.size_options.map((size: string) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                ) : (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{selectedSize || 'N/A'}</span>
                )}
            </div>
            <div className="flex items-center justify-center">
                <div 
                    id={`price-${slugify(product.name)}`}
                    className="text-xl font-bold text-green-600"
                    aria-label={`Price: $${currentPrice?.toFixed(2) || 'N/A'}`}
                >
                    ${currentPrice?.toFixed(2) || 'N/A'}
                </div>
            </div>
        </div>
    )
}
