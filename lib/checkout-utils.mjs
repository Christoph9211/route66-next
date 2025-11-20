import crypto from 'node:crypto'

const asNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

export function validateCartPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid checkout payload')
  }

  const items = Array.isArray(payload.items) ? payload.items : []
  if (items.length === 0) {
    throw new Error('Cart items are required')
  }

  let currency = payload.currency || items[0]?.currency || 'USD'
  let total = 0

  for (const item of items) {
    if (!item || typeof item !== 'object') {
      throw new Error('Each item must be an object')
    }
    if (!item.variantId || !item.name) {
      throw new Error('Item variantId and name are required')
    }
    const qty = asNumber(item.qty)
    const price = asNumber(item.unitPrice)
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error('Item quantities must be positive numbers')
    }
    if (!Number.isFinite(price) || price < 0) {
      throw new Error('Item prices must be non-negative numbers')
    }

    total += price * qty
    if (item.currency && !currency) {
      currency = item.currency
    }
  }

  total = Number(total.toFixed(2))
  const providedTotal = asNumber(payload.total ?? payload.expectedTotal)
  if (
    Number.isFinite(providedTotal) &&
    Math.abs(providedTotal - total) > 0.01
  ) {
    throw new Error('Cart total does not match calculated sum')
  }

  return {
    items,
    total,
    currency,
    customer: payload.customer || {},
    shipping: payload.shipping || {},
  }
}

export function verifyWebhookSignature(body, signature, secret) {
  if (!secret || !signature) return false
  const computed = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  const providedBuffer = Buffer.from(signature, 'hex')
  const computedBuffer = Buffer.from(computed, 'hex')
  if (providedBuffer.length !== computedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(providedBuffer, computedBuffer)
}

export function buildCartHash(payload) {
  const normalized = {
    items: Array.isArray(payload.items)
      ? payload.items.map((item) => ({
          variantId: item.variantId,
          qty: item.qty,
          price: item.unitPrice,
        }))
      : [],
    total: payload.total,
    customer: payload.customer || {},
    shipping: payload.shipping || {},
  }

  return crypto
    .createHash('sha256')
    .update(JSON.stringify(normalized))
    .digest('hex')
}
