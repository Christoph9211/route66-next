import type { Product, ProductMap } from '@/types/product'

type ProductSortPriority = 'featured' | 'price-asc' | 'price-desc'

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
