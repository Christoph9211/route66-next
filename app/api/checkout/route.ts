import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null)
    if (!payload?.cart?.items?.length) {
        return NextResponse.json(
            { message: 'Cart is empty' },
            { status: 400 }
        )
    }

    const orderNumber = `R66-${Date.now().toString().slice(-6)}`
    return NextResponse.json({
        orderNumber,
        status: 'confirmed',
        receivedAt: new Date().toISOString(),
        estimatedShipDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    })
}
