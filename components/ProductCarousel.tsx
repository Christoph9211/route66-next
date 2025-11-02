'use client'

import { useId, useRef } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/types/product'
import { slugify } from '@/utils/slugify'

interface CarouselCta {
    label: string
    href: string
}

interface ProductCarouselProps {
    title: string
    products: Product[]
    description?: string
    sectionId?: string
    cta?: CarouselCta
}

const SCROLL_STEP = 320

export default function ProductCarousel({ title, products, description, sectionId, cta }: ProductCarouselProps) {
    const listRef = useRef<HTMLDivElement>(null)
    const generatedId = useId()
    const resolvedSectionId = sectionId ?? slugify(`${title}-${generatedId}`)
    const headingId = `${resolvedSectionId}-heading`
    const descriptionId = description ? `${resolvedSectionId}-description` : undefined
    const listId = `${resolvedSectionId}-list`

    if (!products || products.length === 0) {
        return null
    }

    const handleScroll = (direction: 'left' | 'right') => {
        const container = listRef.current
        if (!container) {
            return
        }

        const delta = direction === 'left' ? -SCROLL_STEP : SCROLL_STEP
        container.scrollBy({ left: delta, behavior: 'smooth' })
    }

    return (
        <section
            id={resolvedSectionId}
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            className="py-12"
            data-section-nav
        >
            <div className="container mx-auto px-4">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-2xl space-y-2">
                        <h2 id={headingId} className="text-2xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {description ? (
                            <p id={descriptionId} className="text-base text-gray-600 dark:text-gray-300">
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleScroll('left')}
                            className="focus-enhanced inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:border-green-400 dark:hover:text-green-300 dark:focus:ring-offset-gray-900"
                            aria-controls={listId}
                            aria-label={`Scroll ${title} carousel backward`}
                        >
                            <span aria-hidden="true">&#8592;</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleScroll('right')}
                            className="focus-enhanced inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:border-green-400 dark:hover:text-green-300 dark:focus:ring-offset-gray-900"
                            aria-controls={listId}
                            aria-label={`Scroll ${title} carousel forward`}
                        >
                            <span aria-hidden="true">&#8594;</span>
                        </button>
                        {cta ? (
                            <a
                                href={cta.href}
                                className="focus-enhanced inline-flex items-center justify-center rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-600 hover:text-white dark:text-green-300"
                            >
                                {cta.label}
                            </a>
                        ) : null}
                    </div>
                </div>
                <div className="relative">
                    <div
                        id={listId}
                        ref={listRef}
                        role="list"
                        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
                        aria-label={title}
                    >
                        {products.map((product, index) => (
                            <div key={product.name} role="listitem" className="snap-start">
                                <ProductCard
                                    product={product}
                                    gridIndex={index}
                                    gridSize={products.length}
                                    variant="compact"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent dark:from-gray-950" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent dark:from-gray-950" />
                </div>
            </div>
        </section>
    )
}
