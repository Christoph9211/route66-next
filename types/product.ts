export interface Product {
  name: string
  category: string
  image: string
  size_options: string[]
  prices: Record<string, number>
  thca_percentage?: number
  banner?: string
  availability?: Record<string, boolean>
}

export type ProductMap = Record<string, Product[]>
