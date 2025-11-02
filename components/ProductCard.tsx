'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { slugify } from '@/utils/slugify'
import type { Product } from '@/types/product'
import ProductQuickView from './ProductQuickView'

interface ProductCardProps {
    product: Product
    priority?: boolean
    gridIndex?: number
    gridSize?: number
    parentHeadingId?: string
    variant?: 'default' | 'compact'
}

export default function ProductCard({
    product,
    priority = false,
    gridIndex,
    gridSize,
    parentHeadingId,
    variant = 'default',
}: ProductCardProps) {
    const initialSize = useMemo(() => {
        if (product.availability && typeof product.availability === 'object') {
            const firstAvailable = product.size_options.find((size) => product.availability?.[size] !== false)
            if (firstAvailable) {
                return firstAvailable
            }
        }
        return product.size_options[0]
    }, [product.availability, product.size_options])

    const [selectedSize, setSelectedSize] = useState(initialSize)
    const [isQuickViewOpen, setQuickViewOpen] = useState(false)

    useEffect(() => {
        setSelectedSize(initialSize)
    }, [initialSize])

    const variantAvailability = useMemo(() => {
        if (typeof product.availability === 'boolean') {
            return product.availability
        }
        if (product.availability && typeof product.availability === 'object') {
            return product.availability[selectedSize]
        }
        return undefined
    }, [product.availability, selectedSize])

    const isVariantAvailable = variantAvailability !== false
    const isOutOfStockBanner = product.banner === 'Out of Stock'
    const isOutOfStock = isOutOfStockBanner || !isVariantAvailable
    const isCompact = variant === 'compact'

    const currentPrice = selectedSize ? product.prices[selectedSize] : undefined
    const cardId = ['product', slugify(product.name)].join('-')
    const titleId = [cardId, 'title'].join('-')
    const categoryId = [cardId, 'category'].join('-')
    const priceId = [cardId, 'price'].join('-')
    const availabilityId = [cardId, 'availability'].join('-')
    const posInSet = typeof gridIndex === 'number' ? gridIndex + 1 : undefined
    const setSize = typeof gridSize === 'number' ? gridSize : undefined
    const availabilityLabel = isOutOfStock
        ? 'Currently unavailable'
        : variantAvailability === true
            ? 'In stock'
            : 'Available'
    const priceLabel = typeof currentPrice === 'number' ? `$${currentPrice.toFixed(2)}` : 'Price unavailable'
    const describedByIds = [categoryId, availabilityId, priceId]
    if (parentHeadingId) {
        describedByIds.unshift(parentHeadingId)
    }
    const describedBy = describedByIds.join(' ')
    const productId = slugify(product.name)
    const variantId = slugify(`${product.name}-${selectedSize || 'standard'}`)
    const variantDisplayName = selectedSize ? `${product.name} (${selectedSize})` : product.name
    const addToCartDisabled = isOutOfStock || typeof currentPrice !== 'number'

    const getSizeStatus = (size: string) => {
        if (typeof product.availability === 'boolean') {
            return product.availability
        }
        if (product.availability && typeof product.availability === 'object') {
            return product.availability[size]
        }
        return undefined
    }

    const baseCardClasses =
        'product-card relative flex h-full w-full flex-col rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800 focus-enhanced'
    const layoutClasses = isCompact
        ? ' min-w-[220px] p-4 sm:min-w-[240px]'
        : ' sm:w-fit sm:min-w-[285px] p-6'
    const stateClasses = isOutOfStock ? ' opacity-75' : ''

    const addToCartClasses = [
        'add-to-cart inline-flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        addToCartDisabled ? 'cursor-not-allowed opacity-80 hover:bg-green-600' : 'hover:bg-green-700',
        !isCompact ? '' : 'sm:w-full',
    ]
        .filter(Boolean)
        .join(' ')

    const quickViewClasses = isCompact
        ? 'inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:border-green-400 dark:hover:text-green-300 dark:focus:ring-offset-gray-900'
        : 'inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:border-green-400 dark:hover:text-green-300 dark:focus:ring-offset-gray-900'

    return (
        <>
            <article
                id={cardId}
                className={`${baseCardClasses}${layoutClasses}${stateClasses}`}
                tabIndex={0}
                data-product-card="true"
                data-grid-index={typeof gridIndex === 'number' ? gridIndex : undefined}
                aria-labelledby={titleId}
                aria-describedby={describedBy}
                aria-posinset={posInSet}
                aria-setsize={setSize}
            >
                <div className={`relative ${isCompact ? 'mb-3' : 'mb-4'}`}>
                    <div
                        className={`relative ${isCompact ? 'h-40' : 'h-48'} w-full overflow-hidden rounded-lg`}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={480}
                            height={360}
                            priority={priority}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    {product.banner && (
                        <span
                            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm ${
                                product.banner === 'New'
                                    ? 'bg-green-700 text-white'
                                    : product.banner === 'Out of Stock'
                                        ? 'bg-red-700 text-white'
                                        : 'bg-blue-700 text-white'
                            }`}
                        >
                            {product.banner}
                        </span>
                    )}
                </div>
                <div className="mb-4 flex-1">
                    <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                    <p id={categoryId} className="text-sm text-gray-600 dark:text-gray-300">{product.category || 'N/A'}</p>
                    {product.thca_percentage ? (
                        <p className="text-sm font-medium text-green-600">THCa: {product.thca_percentage}%</p>
                    ) : (
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Potency info coming soon</p>
                    )}
                    <p id={availabilityId} className="text-sm text-gray-600 dark:text-gray-300">{availabilityLabel}</p>
                </div>
                <div className="mb-4">
                    {isCompact ? (
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Starting at</p>
                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                {priceLabel}
                                {selectedSize ? <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({selectedSize})</span> : null}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Choose a size</p>
                            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a size">
                                {product.size_options.map((size) => {
                                    const status = getSizeStatus(size)
                                    const isSelected = selectedSize === size
                                    const isAvailableForSize = status !== false
                                    const statusLabel = status === false ? 'Unavailable' : 'In stock'
                                    const buttonClasses = [
                                        'flex min-w-[72px] flex-col items-center justify-center rounded-md border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                                        isSelected ? 'border-green-600 bg-green-600 text-white shadow-sm' : '',
                                        !isSelected && isAvailableForSize
                                            ? 'border-gray-300 bg-white text-gray-900 hover:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-green-400'
                                            : '',
                                        !isAvailableForSize
                                            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-500'
                                            : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')

                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => isAvailableForSize && setSelectedSize(size)}
                                            className={buttonClasses}
                                            aria-pressed={isSelected}
                                            aria-label={`${size} - ${statusLabel}`}
                                            title={`${size} - ${statusLabel}`}
                                            disabled={!isAvailableForSize}
                                        >
                                            <span className="text-sm font-semibold">{size}</span>
                                            <span className="text-[10px] font-normal uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                {statusLabel}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-auto space-y-4 pt-2">
                    <div className="flex items-baseline justify-between">
                        <div id={priceId} className="text-xl font-bold text-green-600">
                            {priceLabel}
                        </div>
                        {selectedSize && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">per {selectedSize}</span>
                        )}
                    </div>
                    <div className={`flex flex-col gap-2 ${isCompact ? '' : 'sm:flex-row'}`}>
                        <button
                            type="button"
                            className={addToCartClasses}
                            data-product-id={productId}
                            data-variant-id={variantId}
                            data-name={variantDisplayName}
                            data-image={product.image}
                            data-price={typeof currentPrice === 'number' ? String(currentPrice) : undefined}
                            data-currency="USD"
                            disabled={addToCartDisabled}
                            aria-disabled={addToCartDisabled}
                        >
                            {addToCartDisabled ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setQuickViewOpen(true)}
                            className={quickViewClasses}
                            aria-haspopup="dialog"
                            aria-controls={`${cardId}-quick-view`}
                        >
                            Quick view
                        </button>
                    </div>
                </div>
            </article>
            {isQuickViewOpen && (
                <ProductQuickView
                    product={product}
                    onClose={() => setQuickViewOpen(false)}
                    initialSize={selectedSize}
                    modalId={`${cardId}-quick-view`}
                />
            )}
        </>
    )
}
