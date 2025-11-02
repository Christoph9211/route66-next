'use client'

import type { ChangeEvent } from 'react'
import type { ProductSortOrder } from '@/lib/products'

export type FilterState = {
    minPrice: string
    maxPrice: string
    onlyInStock: boolean
    potencyEnabled: boolean
    minPotency: number
    maxPotency: number
}

interface FilterPanelProps {
    sortOrder: ProductSortOrder
    onSortOrderChange: (event: ChangeEvent<HTMLSelectElement>) => void
    filters: FilterState
    onMinPriceChange: (event: ChangeEvent<HTMLInputElement>) => void
    onMaxPriceChange: (event: ChangeEvent<HTMLInputElement>) => void
    onInStockToggle: (event: ChangeEvent<HTMLInputElement>) => void
    onPotencyToggle: (event: ChangeEvent<HTMLInputElement>) => void
    onMinPotencyChange: (event: ChangeEvent<HTMLInputElement>) => void
    onMaxPotencyChange: (event: ChangeEvent<HTMLInputElement>) => void
    filtersDisabled: boolean
    categoryPriceBounds: { min: number; max: number } | null
    className?: string
    headingId?: string
    isSticky?: boolean
}

export default function FilterPanel({
    sortOrder,
    onSortOrderChange,
    filters,
    onMinPriceChange,
    onMaxPriceChange,
    onInStockToggle,
    onPotencyToggle,
    onMinPotencyChange,
    onMaxPotencyChange,
    filtersDisabled,
    categoryPriceBounds,
    className = '',
    headingId = 'product-filters-heading',
    isSticky = true,
}: FilterPanelProps) {
    const positionClass = isSticky ? 'sticky top-24' : ''

    return (
        <aside
            aria-labelledby={headingId}
            className={`${positionClass} space-y-6 ${className}`.trim()}
        >
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="space-y-4">
                    <div>
                        <h3
                            id={headingId}
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                        >
                            Refine results
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Adjust the filters to narrow the products in the selected category.
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="product-sort-select"
                            className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300"
                        >
                            Sort products
                        </label>
                        <select
                            id="product-sort-select"
                            value={sortOrder}
                            onChange={onSortOrderChange}
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            disabled={filtersDisabled}
                        >
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <fieldset>
                    <legend className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        Filter products
                    </legend>
                    <div className="mt-6 space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                Price range
                            </h4>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label
                                        htmlFor="price-min-input"
                                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        Minimum price ($)
                                    </label>
                                    <input
                                        id="price-min-input"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={filters.minPrice}
                                        onChange={onMinPriceChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white"
                                        aria-describedby="price-filter-help"
                                        disabled={filtersDisabled}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="price-max-input"
                                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        Maximum price ($)
                                    </label>
                                    <input
                                        id="price-max-input"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={filters.maxPrice}
                                        onChange={onMaxPriceChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white"
                                        aria-describedby="price-filter-help"
                                        disabled={filtersDisabled}
                                    />
                                </div>
                                <p
                                    id="price-filter-help"
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                >
                                    {categoryPriceBounds
                                        ? `Products in this category range from $${categoryPriceBounds.min.toFixed(2)} to $${categoryPriceBounds.max.toFixed(2)}.`
                                        : 'Enter a minimum and maximum price to narrow the product list.'}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                Availability
                            </h4>
                            <label className="mt-4 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    onChange={onInStockToggle}
                                    checked={filters.onlyInStock}
                                    disabled={filtersDisabled}
                                />
                                Only show in-stock items
                            </label>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                Potency (THCa %)
                            </h4>
                            <div className="mt-4 space-y-4">
                                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        onChange={onPotencyToggle}
                                        checked={filters.potencyEnabled}
                                        disabled={filtersDisabled}
                                    />
                                    Enable potency range filter
                                </label>
                                <div className="space-y-4" aria-disabled={!filters.potencyEnabled || filtersDisabled}>
                                    <div>
                                        <label
                                            htmlFor="potency-min-input"
                                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Minimum potency: <span className="font-semibold">{filters.minPotency}%</span>
                                        </label>
                                        <input
                                            id="potency-min-input"
                                            type="range"
                                            min={0}
                                            max={50}
                                            step={1}
                                            value={filters.minPotency}
                                            onChange={onMinPotencyChange}
                                            className="w-full"
                                            disabled={filtersDisabled || !filters.potencyEnabled}
                                            aria-valuetext={`${filters.minPotency}%`}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="potency-max-input"
                                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Maximum potency: <span className="font-semibold">{filters.maxPotency}%</span>
                                        </label>
                                        <input
                                            id="potency-max-input"
                                            type="range"
                                            min={0}
                                            max={50}
                                            step={1}
                                            value={filters.maxPotency}
                                            onChange={onMaxPotencyChange}
                                            className="w-full"
                                            disabled={filtersDisabled || !filters.potencyEnabled}
                                            aria-valuetext={`${filters.maxPotency}%`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </aside>
    )
}
