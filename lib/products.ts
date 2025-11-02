import type { Product, ProductMap } from '@/types/product'

type ProductSortPriority = 'featured' | 'price-asc' | 'price-desc'

const CURATED_LIMIT = 12

function getProductPriority(product: Product): number {
  switch (product.banner) {
    case 'New':
      return 0
    case 'Out of Stock':
      return 2
    default:
      return 1
  }
}

function compareByFeatured(a: Product, b: Product): number {
  const priorityDelta = getProductPriority(a) - getProductPriority(b)
  if (priorityDelta !== 0) {
    return priorityDelta
  }

  return a.name.localeCompare(b.name)
}

function getProductPrices(product: Product): number[] {
  return Object.values(product.prices ?? {})
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value))
}

export function getMinimumProductPrice(product: Product): number | null {
  const prices = getProductPrices(product)

  if (prices.length === 0) {
    return null
  }

  return Math.min(...prices)
}

function getAverageProductPrice(product: Product): number | null {
  const prices = getProductPrices(product)

  if (prices.length === 0) {
    return null
  }

  const total = prices.reduce((sum, value) => sum + value, 0)
  return total / prices.length
}

function compareByPrice(order: Exclude<ProductSortPriority, 'featured'>) {
  return (a: Product, b: Product): number => {
    const minPriceA = getMinimumProductPrice(a)
    const minPriceB = getMinimumProductPrice(b)

    if (minPriceA === null && minPriceB === null) {
      return compareByFeatured(a, b)
    }

    if (minPriceA === null) {
      return 1
    }

    if (minPriceB === null) {
      return -1
    }

    const priceDelta =
      order === 'price-asc' ? minPriceA - minPriceB : minPriceB - minPriceA

    if (priceDelta !== 0) {
      return priceDelta
    }

    return compareByFeatured(a, b)
  }
}

function sortProducts(products: Product[]): Product[] {
  return [...products].sort(compareByFeatured)
}

export type ProductSortOrder = ProductSortPriority

export function sortProductsByOrder(
  products: Product[],
  order: ProductSortOrder
): Product[] {
  switch (order) {
    case 'price-asc':
      return [...products].sort(compareByPrice('price-asc'))
    case 'price-desc':
      return [...products].sort(compareByPrice('price-desc'))
    case 'featured':
    default:
      return sortProducts(products)
  }
}

export function groupProductsByCategory(products: Product[]): ProductMap {
  const map: ProductMap = {}
  for (const product of products) {
    const category = product.category || 'Uncategorized'
    if (!map[category]) {
      map[category] = []
    }
    map[category].push(product)
  }

  for (const [category, items] of Object.entries(map)) {
    map[category] = sortProducts(items)
  }

  return map
}

export { sortProducts }

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>()
  const result: Product[] = []

  for (const product of products) {
    const key = product.name.toLowerCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(product)
  }

  return result
}

function limitProducts(products: Product[], limit: number): Product[] {
  if (products.length <= limit) {
    return products
  }

  return products.slice(0, limit)
}

function sortByAveragePriceDesc(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const avgPriceA = getAverageProductPrice(a)
    const avgPriceB = getAverageProductPrice(b)

    if (avgPriceA === null && avgPriceB === null) {
      return compareByFeatured(a, b)
    }

    if (avgPriceA === null) {
      return 1
    }

    if (avgPriceB === null) {
      return -1
    }

    const delta = avgPriceB - avgPriceA
    if (delta !== 0) {
      return delta
    }

    return compareByFeatured(a, b)
  })
}

function sortByMinimumPriceAsc(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const minPriceA = getMinimumProductPrice(a)
    const minPriceB = getMinimumProductPrice(b)

    if (minPriceA === null && minPriceB === null) {
      return compareByFeatured(a, b)
    }

    if (minPriceA === null) {
      return 1
    }

    if (minPriceB === null) {
      return -1
    }

    const delta = minPriceA - minPriceB
    if (delta !== 0) {
      return delta
    }

    return compareByFeatured(a, b)
  })
}

function filterAvailableProducts(products: Product[]): Product[] {
  return products.filter((product) => product.banner !== 'Out of Stock')
}

export function getFeaturedProducts(
  products: Product[],
  limit: number = CURATED_LIMIT
): Product[] {
  const bannerMatches = products.filter((product) =>
    product.banner ? ['Featured', 'Staff Pick', 'Editor\'s Pick'].includes(product.banner) : false
  )

  const highlighted = bannerMatches.length > 0 ? bannerMatches : filterAvailableProducts(products)
  const sorted = sortByAveragePriceDesc(highlighted)

  return limitProducts(dedupeProducts(sorted), limit)
}

export function getNewArrivals(
  products: Product[],
  limit: number = CURATED_LIMIT
): Product[] {
  const newItems = products.filter((product) => product.banner === 'New')
  const sorted = sortProducts(newItems)

  return limitProducts(sorted, limit)
}

export function getBestsellers(
  products: Product[],
  limit: number = CURATED_LIMIT
): Product[] {
  const availableProducts = filterAvailableProducts(products)
  const sorted = sortByMinimumPriceAsc(availableProducts)

  return limitProducts(sorted, limit)
}

export interface CuratedCollections {
  featured: Product[]
  newArrivals: Product[]
  bestsellers: Product[]
}

export function buildCuratedCollections(
  products: Product[],
  limit: number = CURATED_LIMIT
): CuratedCollections {
  return {
    featured: getFeaturedProducts(products, limit),
    newArrivals: getNewArrivals(products, limit),
    bestsellers: getBestsellers(products, limit),
  }
}
