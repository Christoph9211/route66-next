import { NextRequest, NextResponse } from 'next/server'
import getConfig from 'next/config'
import {
    buildCartHash,
    validateCartPayload,
    verifyWebhookSignature,
} from '../../../lib/checkout-utils.mjs'
import {
    findTransactionByHash,
    recordTransaction,
    updateTransactionStatus,
} from '../../../lib/transaction-store'

interface CloverConfig {
    merchantId: string
    apiKey: string
    baseUrl: string
    webhookSecret?: string
    allowedOrigins?: string
}

const { serverRuntimeConfig } = getConfig()
const cloverConfig: CloverConfig = {
    merchantId:
        serverRuntimeConfig?.clover?.merchantId ||
        process.env.CLOVER_MERCHANT_ID ||
        '',
    apiKey:
        serverRuntimeConfig?.clover?.apiKey || process.env.CLOVER_API_KEY || '',
    baseUrl:
        serverRuntimeConfig?.clover?.baseUrl ||
        process.env.CLOVER_BASE_URL ||
        'https://sandbox.dev.clover.com',
    webhookSecret:
        serverRuntimeConfig?.clover?.webhookSecret ||
        process.env.CLOVER_WEBHOOK_SECRET,
    allowedOrigins:
        serverRuntimeConfig?.clover?.allowedOrigins ||
        process.env.CLOVER_ALLOWED_ORIGINS,
}

function enforceHttps(req: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        const protocol = req.nextUrl.protocol
        if (protocol !== 'https:') {
            return NextResponse.json(
                { error: 'HTTPS is required.' },
                {
                    status: 400,
                }
            )
        }
    }
    return null
}

function enforceOrigin(req: NextRequest) {
    const origins = (cloverConfig.allowedOrigins || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    if (origins.length === 0) return null

    const requestOrigin = req.headers.get('origin')
    if (!requestOrigin || !origins.includes(requestOrigin)) {
        return NextResponse.json(
            { error: 'Origin not allowed.' },
            {
                status: 403,
            }
        )
    }

    return null
}

async function createCloverOrder({
    items,
    currency,
    total,
    customer,
    shipping,
}: {
    items: Array<{ variantId: string; name: string; qty: number; unitPrice: number }>
    currency: string
    total: number
    customer: Record<string, unknown>
    shipping: Record<string, unknown>
}) {
    const orderUrl = `${cloverConfig.baseUrl}/v3/merchants/${cloverConfig.merchantId}/orders`
    const response = await fetch(orderUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cloverConfig.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            state: 'open',
            currency,
            total,
            lineItems: items.map((item) => ({
                name: item.name,
                price: item.unitPrice,
                quantity: item.qty,
            })),
            metadata: {
                customer,
                shipping,
            },
        }),
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Clover order failed: ${text}`)
    }

    return response.json()
}

async function createCloverPayment({
    orderId,
    total,
    currency,
}: {
    orderId: string
    total: number
    currency: string
}) {
    const paymentUrl = `${cloverConfig.baseUrl}/v3/merchants/${cloverConfig.merchantId}/payments`
    const response = await fetch(paymentUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cloverConfig.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId,
            amount: total,
            currency,
        }),
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Clover payment failed: ${text}`)
    }

    return response.json()
}

async function handleCheckout(req: NextRequest) {
    if (!cloverConfig.apiKey || !cloverConfig.merchantId) {
        return NextResponse.json(
            { error: 'Clover credentials are not configured.' },
            { status: 500 }
        )
    }

    const httpsError = enforceHttps(req)
    if (httpsError) return httpsError

    const originError = enforceOrigin(req)
    if (originError) return originError

    let payload: any
    try {
        payload = await req.json()
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON payload.' },
            { status: 400 }
        )
    }

    try {
        const { items, total, currency, customer, shipping } =
            validateCartPayload(payload)

        const cartHash = buildCartHash(payload)
        const existing = await findTransactionByHash(cartHash)
        if (existing) {
            return NextResponse.json({
                orderId: existing.orderId,
                paymentId: existing.paymentId,
                status: existing.status,
            })
        }

        const order = await createCloverOrder({
            items,
            currency,
            total,
            customer,
            shipping,
        })

        const payment = await createCloverPayment({
            orderId: order.id,
            total,
            currency,
        })

        const transaction = {
            orderId: order.id,
            paymentId: payment.id,
            status: payment.status || 'created',
            cartHash,
            amount: total,
            createdAt: new Date().toISOString(),
        }

        await recordTransaction(transaction)

        return NextResponse.json({
            orderId: order.id,
            paymentId: payment.id,
            status: payment.status || 'created',
            checkoutUrl:
                payment.checkoutUrl || payment.approvalUrl || payment.href,
            clientToken: payment.clientToken,
        })
    } catch (error) {
        console.error('Checkout error', error)
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Checkout failed.',
            },
            { status: 400 }
        )
    }
}

async function handleWebhook(req: NextRequest) {
    const rawBody = await req.text()
    const signature = req.headers.get('x-clover-signature') || ''

    if (
        !verifyWebhookSignature(
            rawBody,
            signature,
            cloverConfig.webhookSecret || ''
        )
    ) {
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
        )
    }

    try {
        const event = JSON.parse(rawBody)
        const paymentId =
            event?.payment?.id || event?.data?.id || event?.id || ''
        const status = event?.payment?.status || event?.type || 'updated'

        if (paymentId) {
            await updateTransactionStatus(paymentId, status)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid webhook payload' },
            { status: 400 }
        )
    }
}

export async function POST(req: NextRequest) {
    if (req.headers.get('x-clover-signature')) {
        return handleWebhook(req)
    }

    return handleCheckout(req)
}
