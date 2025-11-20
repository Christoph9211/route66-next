export interface CartItem {
    productId: string
    variantId: string
    name: string
    image: string
    unitPrice: number
    currency: string
    qty: number
}

export interface Cart {
    items: CartItem[]
    subtotal: number
    total: number
    currency: string
}

export interface CheckoutCustomer {
    name: string
    email?: string
    phone?: string
}

export interface ShippingAddress {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country?: string
}

export interface CheckoutResponse {
    orderId: string
    paymentId?: string
    checkoutUrl?: string
    clientToken?: string
    status: string
}
