import type { Product, ProductMap } from '@/types/product'

function sortProducts(products: Product[]): Product[] {
  const priority = (product: Product): number => {
    switch (product.banner) {
      case 'New':
        return 0
      case 'Out of Stock':
        return 2
      default:
        return 1
    }
  }

  return [...products].sort((a, b) => {
    const priorityDelta = priority(a) - priority(b)
    if (priorityDelta !== 0) {
      return priorityDelta
    }

    return a.name.localeCompare(b.name)
  })
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
