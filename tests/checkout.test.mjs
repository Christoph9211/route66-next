import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

import {
  validateCartPayload,
  verifyWebhookSignature,
  buildCartHash,
} from '../lib/checkout-utils.mjs'

test('validateCartPayload rejects mismatched totals', () => {
  assert.throws(
    () =>
      validateCartPayload({
        items: [
          { variantId: 'a', name: 'Item', unitPrice: 10, qty: 1 },
          { variantId: 'b', name: 'Item 2', unitPrice: 5, qty: 1 },
        ],
        total: 10,
      }),
    /total does not match/
  )
})

test('validateCartPayload returns totals when valid', () => {
  const payload = validateCartPayload({
    items: [{ variantId: 'a', name: 'Item', unitPrice: 10, qty: 2 }],
    total: 20,
  })
  assert.equal(payload.total, 20)
  assert.equal(payload.currency, 'USD')
  assert.equal(payload.items.length, 1)
})

test('verifyWebhookSignature checks hmac integrity', () => {
  const secret = 'top-secret'
  const body = JSON.stringify({ id: 'evt_123', data: {} })
  const signature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  assert.equal(verifyWebhookSignature(body, signature, secret), true)
  assert.equal(verifyWebhookSignature(body, 'bad', secret), false)
})

test('buildCartHash is deterministic', () => {
  const first = buildCartHash({
    items: [{ variantId: 'a', qty: 1, unitPrice: 5 }],
    customer: { email: 'a@example.com' },
    shipping: { line1: '123 Main' },
  })
  const second = buildCartHash({
    items: [{ variantId: 'a', qty: 1, unitPrice: 5 }],
    customer: { email: 'a@example.com' },
    shipping: { line1: '123 Main' },
  })

  assert.equal(first, second)
})
