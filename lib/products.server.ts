import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { Product } from '@/types/product'

const PRODUCTS_PATH = path.join(process.cwd(), 'public', 'products', 'products.json')

type JsonRecord = Record<string, unknown>

type ValidationContext = {
  index: number
}

function assert(condition: unknown, message: string, context?: ValidationContext): asserts condition {
  if (!condition) {
    const prefix = context ? `Product #${context.index}: ` : ''
    throw new Error(prefix + message)
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object'
}

function normaliseString(value: unknown, field: string, ctx: ValidationContext): string {
  assert(typeof value === 'string', `${field} must be a string`, ctx)
  const trimmed = value.trim()
  assert(trimmed.length > 0, `${field} cannot be empty`, ctx)
  return trimmed
}

function normaliseStringArray(value: unknown, field: string, ctx: ValidationContext): string[] {
  assert(Array.isArray(value), `${field} must be an array`, ctx)
  assert(value.length > 0, `${field} cannot be empty`, ctx)
  return value.map((entry, entryIndex) => {
    const normalised = normaliseString(entry, `${field}[${entryIndex}]`, ctx)
    return normalised
  })
}

function normalisePrices(value: unknown, ctx: ValidationContext): Record<string, number> {
  assert(isRecord(value), 'prices must be an object', ctx)
  const entries = Object.entries(value)
  assert(entries.length > 0, 'prices cannot be empty', ctx)

  const result: Record<string, number> = {}
  for (const [key, priceValue] of entries) {
    const label = key.trim()
    assert(label.length > 0, 'price labels cannot be empty', ctx)
    assert(typeof priceValue === 'number' && Number.isFinite(priceValue), `price for "${key}" must be a finite number`, ctx)
    assert(priceValue >= 0, `price for "${key}" cannot be negative`, ctx)
    result[label] = priceValue
  }

  return result
}

function normaliseOptionalNumber(value: unknown, field: string, ctx: ValidationContext): number | undefined {
  if (value === undefined) {
    return undefined
  }

  assert(typeof value === 'number' && Number.isFinite(value), `${field} must be a finite number when present`, ctx)
  assert(value >= 0, `${field} cannot be negative`, ctx)
  return value
}

function normaliseAvailability(value: unknown, ctx: ValidationContext): Record<string, boolean> | undefined {
  if (value === undefined) {
    return undefined
  }

  assert(isRecord(value), 'availability must be an object when present', ctx)
  const result: Record<string, boolean> = {}
  for (const [key, availabilityValue] of Object.entries(value)) {
    const label = key.trim()
    assert(label.length > 0, 'availability keys cannot be empty', ctx)
    assert(typeof availabilityValue === 'boolean', `availability for "${key}" must be boolean`, ctx)
    result[label] = availabilityValue
  }

  return result
}

function parseProduct(value: unknown, index: number): Product {
  const ctx: ValidationContext = { index }
  assert(isRecord(value), 'each entry must be an object', ctx)

  const name = normaliseString(value.name, 'name', ctx)
  const category = normaliseString(value.category, 'category', ctx)
  const image = value.image === undefined ? undefined : normaliseString(value.image, 'image', ctx)
  const sizeOptions = normaliseStringArray(value.size_options, 'size_options', ctx)
  const prices = normalisePrices(value.prices, ctx)
  const thca = normaliseOptionalNumber(value.thca_percentage, 'thca_percentage', ctx)
  const banner = value.banner === undefined ? undefined : normaliseString(value.banner, 'banner', ctx)
  const availability = normaliseAvailability(value.availability, ctx)

  return {
    name,
    category,
    image,
    size_options: sizeOptions,
    prices,
    thca_percentage: thca,
    banner,
    availability,
  }
}

async function loadProducts(): Promise<Product[]> {
  const raw = await readFile(PRODUCTS_PATH, 'utf8')
  let data: unknown

  try {
    data = JSON.parse(raw)
  } catch (error) {
    throw new Error('Unable to parse products.json: ' + (error instanceof Error ? error.message : String(error)))
  }

  assert(Array.isArray(data), 'Products file must contain an array')
  return data.map((entry, index) => parseProduct(entry, index))
}

export async function getProducts(): Promise<Product[]> {
  return loadProducts()
}

