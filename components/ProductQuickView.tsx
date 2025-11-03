'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types/product'
import { slugify } from '@/utils/slugify'

interface ProductQuickViewProps {
    product: Product
    onClose: () => void
    initialSize: string
    modalId: string
}

const CURRENCY = 'USD'

export default function ProductQuickView({ product, onClose, initialSize, modalId }: ProductQuickViewProps) {
    const [selectedSize, setSelectedSize] = useState(initialSize)
    const [quantity, setQuantity] = useState(1)
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    useEffect(() => {
        dialogRef.current?.focus()
        const { style } = document.body
        const previousOverflow = style.overflow
        style.overflow = 'hidden'
        return () => {
            style.overflow = previousOverflow
        }
    }, [])

    const variantAvailability = useMemo(() => {
        if (typeof product.availability === 'boolean') {
            return product.availability
        }
        if (product.availability && typeof product.availability === 'object') {
            return product.availability[selectedSize]
        }
        return undefined
    }, [product.availability, selectedSize])

    const currentPrice = selectedSize ? product.prices[selectedSize] : undefined
    const isAvailable = variantAvailability !== false && typeof currentPrice === 'number'
    const totalPrice = typeof currentPrice === 'number' ? (currentPrice * quantity).toFixed(2) : 'N/A'
    const productId = slugify(product.name)
    const variantId = slugify(`${product.name}-${selectedSize || 'standard'}`)
    const variantDisplayName = selectedSize ? `${product.name} (${selectedSize})` : product.name
    const titleId = `${modalId}-title`
    const descriptionId = `${modalId}-description`

    const getSizeStatus = (size: string) => {
        if (typeof product.availability === 'boolean') {
            return product.availability
        }
        if (product.availability && typeof product.availability === 'object') {
            return product.availability[size]
        }
        return undefined
    }

    const handleAddToCart = () => {
        if (!isAvailable || typeof currentPrice !== 'number') {
            return
        }
        const detail = {
            productId,
            variantId,
            name: variantDisplayName,
            image: product.image,
            unitPrice: currentPrice,
            currency: CURRENCY,
            qty: quantity,
        }
        window.dispatchEvent(new CustomEvent('cart:add', { detail }))
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
            <div
                ref={dialogRef}
                id={modalId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                tabIndex={-1}
                className="relative z-[71] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl outline-none dark:bg-gray-900"
            >
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
                    <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Quick view: {product.name}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close quick view"
                        className="rounded-full p-2 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-offset-gray-900"
                    >
                        <span aria-hidden="true">✕</span>
                    </button>
                </div>
                <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                        <Image
                            src={product.image && product.image.length > 0 ? product.image : '/assets/images/placeholder.webp'}
                            alt={product.name}
                            width={640}
                            height={640}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300" id={descriptionId}>
                                {product.category}
                            </p>
                            {product.thca_percentage && (
                                <p className="text-sm font-medium text-green-600">THCa: {product.thca_percentage}%</p>
                            )}
                            {product.banner && (
                                <span className="inline-flex items-center rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                    {product.banner}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select a size</p>
                            <div className="flex flex-wrap gap-2" role="group" aria-label="Select a size option">
                                {product.size_options.map((size) => {
                                    const status = getSizeStatus(size)
                                    const isSelected = selectedSize === size
                                    const isAvailableForSize = status !== false
                                    const statusLabel = status === false ? 'Unavailable' : 'In stock'
                                    const buttonClasses = [
                                        'flex min-w-[88px] flex-col items-center justify-center rounded-md border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
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
                        </div>
                        <div className="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected size</p>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {selectedSize}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {variantAvailability === false ? 'This size is currently unavailable.' : 'Ready to add to your cart.'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Price</p>
                                <p className="text-lg font-semibold text-green-600">
                                    {typeof currentPrice === 'number' ? `$${currentPrice.toFixed(2)}` : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</span>
                                <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                        className="h-9 w-9 text-lg text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                                        aria-label="Decrease quantity"
                                    >
                                        –
                                    </button>
                                    <span className="w-10 text-center text-sm font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                        className="h-9 w-9 text-lg text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Total</p>
                                <p className="text-lg font-semibold text-green-600" aria-live="polite">
                                    {typeof currentPrice === 'number' ? `$${totalPrice}` : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className={`inline-flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${!isAvailable ? 'cursor-not-allowed opacity-80 hover:bg-green-600' : ''}`}
                                disabled={!isAvailable}
                                aria-disabled={!isAvailable}
                            >
                                {isAvailable ? 'Add to Cart' : 'Unavailable'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:border-red-400 dark:hover:text-red-300 dark:focus:ring-offset-gray-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
