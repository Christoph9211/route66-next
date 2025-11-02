'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import AccessibilityAnnouncer from './AccessibilityAnnouncer'
import { slugify } from '@/utils/slugify'
import { scrollToSection } from '@/utils/scrollToSection'
import type { Product } from '@/types/product'

function SearchNavigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Product[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [announceMessage, setAnnounceMessage] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const dialogRef = useRef<HTMLDivElement | null>(null)
    const optionRefs = useRef<(HTMLLIElement | null)[]>([])
    const previousFocusRef = useRef<HTMLElement | null>(null)
    const listboxId = 'search-navigation-results'

    const hasOpenedRef = useRef(false)
    const hasLoadedProductsRef = useRef(false)
    const isFetchingProductsRef = useRef(false)
    const closingAnnouncementRef = useRef<string | null>(null)
    const pendingFocusRef = useRef<HTMLElement | null>(null)
    const isMountedRef = useRef(true)

    useEffect(() => {
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const loadProducts = useCallback(async () => {
        if (hasLoadedProductsRef.current || isFetchingProductsRef.current) {
            return
        }

        isFetchingProductsRef.current = true
        setIsLoadingProducts(true)
        setLoadError(null)

        try {
            const response = await fetch('/products/products.json', {
                cache: 'force-cache'
            })

            if (!response.ok) {
                throw new Error('Failed to load products')
            }

            const data = (await response.json()) as Product[]

            if (!Array.isArray(data)) {
                throw new Error('Unexpected product response shape')
            }

            hasLoadedProductsRef.current = true

            if (isMountedRef.current) {
                setProducts(data)
            }
        } catch (error) {
            console.error('SearchNavigation: error loading products', error)
            if (isMountedRef.current) {
                setLoadError('Unable to load product search results. Please try again.')
            }
        } finally {
            isFetchingProductsRef.current = false
            if (isMountedRef.current) {
                setIsLoadingProducts(false)
            }
        }
    }, [])

    const handleRetryLoad = useCallback(() => {
        loadProducts()
    }, [loadProducts])

    const openSearch = useCallback(() => {
        previousFocusRef.current = document.activeElement as HTMLElement
        setIsOpen(true)
    }, [])

    const closeSearch = useCallback(
        (
            restoreFocus: boolean = true,
            options?: { focusTarget?: HTMLElement | null; announcement?: string }
        ) => {
            const focusTarget = options?.focusTarget ?? null

            if (options?.announcement) {
                closingAnnouncementRef.current = options.announcement
            } else {
                closingAnnouncementRef.current = null
            }

            pendingFocusRef.current = focusTarget

            setIsOpen(false)
            setQuery('')
            setResults([])
            setSelectedIndex(-1)

            if (restoreFocus && !focusTarget && previousFocusRef.current) {
                previousFocusRef.current.focus()
            }
        },
        []
    )

    useEffect(() => {
        if (!isOpen) {
            return
        }

        loadProducts()
    }, [isOpen, loadProducts])


    const handleResultClick = useCallback(
        (product: Product) => {
            const productSlug = slugify(product.name)
            const hashId = 'product-' + productSlug
            const announcement = `Moving to the ${product.name} product card.`

            setAnnounceMessage(announcement)
            closeSearch(false, {
                announcement
            })

            if (typeof window === 'undefined') {
                return
            }

            const categorySlug = slugify(product.category)

            window.dispatchEvent(
                new CustomEvent('products:select-category', {
                    detail: {
                        categorySlug,
                        categoryName: product.category
                    }
                })
            )

            const attemptFocusAndScroll = (attemptsLeft: number) => {
                if (attemptsLeft <= 0) {
                    return
                }

                const focusTarget = document.getElementById(hashId) as HTMLElement | null

                if (focusTarget) {
                    window.requestAnimationFrame(() => {
                        const scrolled = scrollToSection(hashId, {
                            behavior: 'smooth',
                            block: 'start'
                        })

                        if (!scrolled) {
                            focusTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }

                        try {
                            focusTarget.focus({ preventScroll: true })
                        } catch {
                            focusTarget.focus()
                        }
                    })

                    return
                }

                window.setTimeout(() => attemptFocusAndScroll(attemptsLeft - 1), 50)
            }

            window.setTimeout(() => attemptFocusAndScroll(30), 50)
        },
        [closeSearch]
    )


    const highlightMatch = (text: string, searchTerm: string): React.ReactNode[] => {
        if (!searchTerm) {
            return [text]
        }

        const loweredText = text.toLowerCase()
        const loweredTerm = searchTerm.toLowerCase()
        const segments: React.ReactNode[] = []
        let startIndex = 0
        let matchIndex = loweredText.indexOf(loweredTerm, startIndex)

        while (matchIndex !== -1) {
            if (matchIndex > startIndex) {
                segments.push(text.slice(startIndex, matchIndex))
            }

            const matchEnd = matchIndex + loweredTerm.length
            segments.push(
                <mark key={segments.length} className="bg-yellow-200 dark:bg-yellow-800">
                    {text.slice(matchIndex, matchEnd)}
                </mark>
            )
            startIndex = matchEnd
            matchIndex = loweredText.indexOf(loweredTerm, startIndex)
        }

        if (startIndex < text.length) {
            segments.push(text.slice(startIndex))
        }

        return segments
    }

    const focusOption = useCallback((index: number) => {
        const option = optionRefs.current[index]
        if (option) {
            option.focus()
        }
    }, [])

    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            setSelectedIndex(-1)
            return
        }

        const loweredQuery = query.toLowerCase()
        const filtered = products
            .filter((product) => {
                const matchesName = product.name.toLowerCase().includes(loweredQuery)
                const matchesCategory = product.category.toLowerCase().includes(loweredQuery)
                const matchesSize = product.size_options.some((size: string) =>
                    size.toLowerCase().includes(loweredQuery)
                )
                return matchesName || matchesCategory || matchesSize
            })
            .slice(0, 8)

        setResults(filtered)
        setSelectedIndex(filtered.length ? 0 : -1)
    }, [products, query])

    useEffect(() => {
        optionRefs.current = optionRefs.current.slice(0, results.length)
    }, [results.length])

    useEffect(() => {
        if (!isOpen) {
            if (hasOpenedRef.current) {
                if (closingAnnouncementRef.current) {
                    setAnnounceMessage(closingAnnouncementRef.current)
                    closingAnnouncementRef.current = null
                } else {
                    setAnnounceMessage('Search closed')
                }
            }
            return
        }

        hasOpenedRef.current = true
        closingAnnouncementRef.current = null

        if (!query) {
            setAnnounceMessage('Search input cleared')
            return
        }

        if (results.length === 0 && query.length >= 2) {
            setAnnounceMessage('No matches for ' + query)
        } else if (results.length > 0) {
            const resultText = results.length === 1 ? '1 match' : results.length + ' matches'
            setAnnounceMessage(resultText + ' for ' + query)
        }
    }, [isOpen, query, results])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (isLoadingProducts) {
            setAnnounceMessage('Loading product search results...')
            return
        }

        if (loadError) {
            setAnnounceMessage('Product search is temporarily unavailable. ' + loadError)
            return
        }

        if (!query && hasLoadedProductsRef.current && results.length === 0) {
            setAnnounceMessage('Product search ready. Enter at least two characters to search.')
        }
    }, [isLoadingProducts, isOpen, loadError, query, results.length])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (selectedIndex < 0 || !results[selectedIndex]) {
            return
        }

        const product = results[selectedIndex]
        const position = selectedIndex + 1
        const total = results.length
        const categoryText = product.category ? ` in the ${product.category} category` : ''
        const selectionAnnouncement = `${product.name} selected${categoryText}. Result ${position} of ${total}.`

        setAnnounceMessage(selectionAnnouncement)
    }, [isOpen, results, selectedIndex])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        const focusTimer = window.setTimeout(() => {
            searchInputRef.current?.focus()
        }, 10)

        return () => window.clearTimeout(focusTimer)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) {
                return
            }

            if (event.key === 'Escape') {
                event.preventDefault()
                closeSearch()
                return
            }

            if (event.key === 'Tab') {
                const dialog = dialogRef.current
                if (!dialog) {
                    return
                }

                const focusableSelectors = [
                    'a[href]',
                    'button:not([disabled])',
                    'textarea:not([disabled])',
                    'input:not([disabled])',
                    'select:not([disabled])',
                    '[tabindex]:not([tabindex="-1"])'
                ]

                const focusable = Array.from(
                    dialog.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
                ).filter((element) => !element.hasAttribute('data-focus-exclude'))

                if (!focusable.length) {
                    return
                }

                const first = focusable[0]
                const last = focusable[focusable.length - 1]
                const activeElement = document.activeElement as HTMLElement

                if (event.shiftKey) {
                    if (activeElement === first || !dialog.contains(activeElement)) {
                        event.preventDefault()
                        last.focus()
                    }
                } else if (activeElement === last) {
                    event.preventDefault()
                    first.focus()
                }

                return
            }

            const activeElement = document.activeElement as HTMLElement
            const inputFocused = activeElement === searchInputRef.current
            const optionIndex = optionRefs.current.findIndex((ref) => ref === activeElement)

            if (event.key === 'ArrowDown') {
                event.preventDefault()
                if (!results.length) {
                    return
                }

                if (inputFocused) {
                    setSelectedIndex(0)
                    focusOption(0)
                } else {
                    setSelectedIndex((prev) => {
                        const nextIndex = prev + 1 > results.length - 1 ? 0 : prev + 1
                        focusOption(nextIndex)
                        return nextIndex
                    })
                }

                return
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault()
                if (!results.length) {
                    return
                }

                if (inputFocused || optionIndex === -1) {
                    const lastIndex = results.length - 1
                    setSelectedIndex(lastIndex)
                    focusOption(lastIndex)
                } else {
                    setSelectedIndex((prev) => {
                        const nextIndex = prev - 1 < 0 ? results.length - 1 : prev - 1
                        focusOption(nextIndex)
                        return nextIndex
                    })
                }

                return
            }

            if ((event.key === 'Enter' || event.key === ' ') && optionIndex >= 0) {
                event.preventDefault()
                const product = results[optionIndex]
                if (product) {
                    handleResultClick(product)
                }
            }

            if (event.key === 'Home' && results.length) {
                event.preventDefault()
                setSelectedIndex(0)
                focusOption(0)
                return
            }

            if (event.key === 'End' && results.length) {
                event.preventDefault()
                const lastIndex = results.length - 1
                setSelectedIndex(lastIndex)
                focusOption(lastIndex)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [closeSearch, focusOption, handleResultClick, isOpen, results])

    useEffect(() => {
        if (isOpen) {
            return
        }

        const focusTarget = pendingFocusRef.current
        if (!(focusTarget instanceof HTMLElement)) {
            pendingFocusRef.current = null
            return
        }

        pendingFocusRef.current = null

        const focusTimer = window.setTimeout(() => {
            if (typeof focusTarget.focus === 'function') {
                try {
                    focusTarget.focus({ preventScroll: true })
                } catch {
                    focusTarget.focus()
                }
            }
        }, 0)

        return () => window.clearTimeout(focusTimer)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        const handlePointerDown = (event: PointerEvent) => {
            const dialog = dialogRef.current
            if (dialog && !dialog.contains(event.target as Node)) {
                closeSearch()
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [closeSearch, isOpen])

    return (
        <div className="relative">
            <AccessibilityAnnouncer message={announceMessage} />
            <button
                type="button"
                onClick={() => (isOpen ? closeSearch() : openSearch())}
                className="focus-enhanced flex items-center px-3 py-2 text-sm text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                aria-label="Search products"
                aria-expanded={isOpen}
                aria-controls="search-navigation-dialog"
                aria-haspopup="dialog"
            >
                <i className="fas fa-search mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-20 backdrop-blur-sm"
                    role="presentation"
                >
                    <div
                        ref={dialogRef}
                        id="search-navigation-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="search-navigation-title"
                        aria-describedby="search-navigation-description"
                        data-modal="search-navigation"
                        data-modal-open="true"
                        className="mx-4 w-full max-w-2xl rounded-lg bg-white shadow-xl focus:outline-none dark:bg-gray-800"
                    >
                        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 id="search-navigation-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Quick product search
                                    </h2>
                                    <p id="search-navigation-description" className="text-sm text-gray-600 dark:text-gray-300">
                                        Enter at least two characters to see matching categories, products, or sizes.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => closeSearch()}
                                    className="focus-enhanced ml-4 text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                                    aria-label="Close search dialog"
                                    data-modal-close="true"
                                >
                                    <i className="fas fa-times text-lg" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="relative mt-4">
                                <i
                                    className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                                    aria-hidden="true"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={query}
                                    role="combobox"
                                    aria-controls={listboxId}
                                    aria-expanded={results.length > 0}
                                    aria-autocomplete="list"
                                    aria-activedescendant={selectedIndex >= 0 ? listboxId + '-option-' + selectedIndex : undefined}
                                    onChange={(event) => setQuery(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'ArrowDown' && results.length) {
                                            event.preventDefault()
                                            setSelectedIndex(0)
                                            focusOption(0)
                                        } else if (event.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
                                            event.preventDefault()
                                            handleResultClick(results[selectedIndex])
                                        }
                                    }}
                                    placeholder="Search products, categories, or sizes..."
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto p-2">
                            {isLoadingProducts && (
                                <p className="px-4 py-6 text-sm text-gray-600 dark:text-gray-300">
                                    Loading product data for search&hellip;
                                </p>
                            )}

                            {!isLoadingProducts && loadError && (
                                <div className="px-4 py-6 text-sm text-red-700 dark:text-red-400">
                                    <p>{loadError}</p>
                                    <button
                                        type="button"
                                        onClick={handleRetryLoad}
                                        className="mt-3 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-700 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-900/40"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {!isLoadingProducts && !loadError && query.length < 2 && (
                                <p className="px-4 py-6 text-sm text-gray-600 dark:text-gray-300">
                                    Keep typing to view search suggestions.
                                </p>
                            )}

                            {!isLoadingProducts && !loadError && query.length >= 2 && results.length === 0 && (
                                <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                    <i className="fas fa-search mb-2 text-2xl" aria-hidden="true" />
                                    <p>No products found for &ldquo;{query}&rdquo;.</p>
                                </div>
                            )}

                            {!isLoadingProducts && !loadError && results.length > 0 && (
                                <ul
                                    id={listboxId}
                                    role="listbox"
                                    aria-label="Search results"
                                    className="space-y-2"
                                >
                                    {results.map((product, index) => {
                                        const isActive = selectedIndex === index
                                        const baseClasses = 'w-full cursor-pointer rounded-md border border-transparent p-4 text-left transition-colors'
                                        const stateClasses = isActive
                                            ? 'bg-green-50 ring-2 ring-green-500 dark:bg-green-900 dark:ring-green-400'
                                            : 'bg-white hover:border-green-200 dark:bg-gray-900 dark:hover:border-green-600'
                                        const itemClasses = baseClasses + ' ' + stateClasses
                                        const priceValues = Object.values(product.prices || {}) as number[]
                                        const hasPrices = priceValues.length > 0
                                        const minPrice = hasPrices ? Math.min(...priceValues) : undefined
                                        const priceLabel = typeof minPrice === 'number' && Number.isFinite(minPrice)
                                            ? '$' + minPrice.toFixed(2)
                                            : 'N/A'

                                        return (
                                            <li
                                                key={product.name}
                                                ref={(element) => { optionRefs.current[index] = element }}
                                                role="option"
                                                id={listboxId + '-option-' + index}
                                                tabIndex={isActive ? 0 : -1}
                                                aria-selected={isActive}
                                                className={itemClasses}
                                                onClick={() => handleResultClick(product)}
                                                onFocus={() => setSelectedIndex(index)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {highlightMatch(product.name, query)}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {highlightMatch(product.category, query)}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            Sizes: {product.size_options.join(', ')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-green-600 dark:text-green-300">
                                                            Starting at {priceLabel}
                                                        </p>
                                                        {product.banner && (
                                                            <span className="mt-1 inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-700 dark:text-white">
                                                                {product.banner}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchNavigation

