'use client'
import 'react/jsx-runtime';
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
        'product-card group relative flex h-full w-full flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus-enhanced overflow-hidden'
    const layoutClasses = isCompact
        ? ' min-w-[220px] p-4 sm:min-w-[240px]'
        : ' sm:w-fit sm:min-w-[285px] p-5'
    const stateClasses = isOutOfStock ? ' opacity-75 grayscale-[0.5]' : ''

    const addToCartClasses = [
        'add-to-cart relative inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-theme-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        addToCartDisabled
            ? 'cursor-not-allowed opacity-80 bg-gray-400'
            : 'hover:bg-emerald-500 hover:shadow-theme-glow hover:-translate-y-0.5 active:translate-y-0',
        !isCompact ? '' : 'sm:w-full',
    ]
        .filter(Boolean)
        .join(' ')

    const quickViewClasses = isCompact
        ? 'inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-bold text-gray-600 transition-all hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 dark:focus:ring-offset-gray-900'
        : 'inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 dark:focus:ring-offset-gray-900'

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
                <div className={`relative ${isCompact ? 'mb-3' : 'mb-5'}`}>
                    <div
                        className={`relative ${isCompact ? 'h-40' : 'h-52'} w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900`}
                    >
                        <Image
                            src={product.image && product.image.length > 0 ? product.image : '/assets/images/placeholder.webp'}
                            alt={product.name || 'Product image'}
                            width={480}
                            height={360}
                            priority={priority}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    {product.banner && (
                        <span
                            className={`product-banner ${product.banner === 'New'
                                    ? 'bg-emerald-600 text-white'
                                    : product.banner === 'Out of Stock'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-indigo-600 text-white'
                                }`}
                        >
                            {product.banner}
                        </span>
                    )}
                </div>
                <div className="mb-4 flex-1">
                    <h3 id={titleId} className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{product.name}</h3>
                    <p id={categoryId} className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{product.category || 'N/A'}</p>
                    {product.thca_percentage ? (
                        <div className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-500/20">
                            THCa: {product.thca_percentage}%
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500">Potency info coming soon</p>
                    )}
                    <p id={availabilityId} className="sr-only">{availabilityLabel}</p>
                </div>
                <div className="mb-5">
                    {isCompact ? (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Starting at</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {priceLabel}
                                {selectedSize ? <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">/ {selectedSize}</span> : null}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Size</p>
                            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a size">
                                {product.size_options.map((size) => {
                                    const status = getSizeStatus(size)
                                    const isSelected = selectedSize === size
                                    const isAvailableForSize = status !== false
                                    const statusLabel = status === false ? 'Unavailable' : 'In stock'
                                    const buttonClasses = [
                                        'flex min-w-[72px] flex-col items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                                        isSelected
                                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-md transform scale-105'
                                            : '',
                                        !isSelected && isAvailableForSize
                                            ? 'border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-400 hover:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-emerald-500'
                                            : '',
                                        !isAvailableForSize
                                            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-600'
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
                                            <span className="text-sm font-bold">{size}</span>
                                            <span className={`text-[10px] font-medium uppercase tracking-wide ${isSelected ? 'text-emerald-100' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {statusLabel}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-auto space-y-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <div className="flex items-baseline justify-between">
                        <div id={priceId} className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {priceLabel}
                        </div>
                    </div>
                    <div className={`flex flex-col gap-3 ${isCompact ? '' : 'sm:flex-row'}`}>
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
                            {addToCartDisabled ? 'Out of Stock' : (
                                <>
                                    <i className="fas fa-shopping-cart mr-2" /> Add to Cart
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setQuickViewOpen(true)}
                            className={quickViewClasses}
                            aria-haspopup="dialog"
                            aria-controls={`${cardId}-quick-view`}
                        >
                            <i className="fas fa-eye mr-2" /> Quick view
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
