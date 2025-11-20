'use client';
import React, { useMemo, useState } from 'react'
import { useCart } from '../hooks/useCart'

/**
 * Renders the cart page.
 *
 * @return {JSX.Element|null} The cart page component or null if the page is not open.
 */
export default function CartPage() {
    const { cart, isPageOpen, closeCartPage, removeItem, submitCheckout } =
        useCart()
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [shippingAddress, setShippingAddress] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
    })
    const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)

    const formattedTotal = useMemo(
        () => `${cart.currency || 'USD'} ${cart.total.toFixed(2)}`,
        [cart.currency, cart.total]
    )

    if (!isPageOpen) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            id="cart-panel"
            className="fixed inset-0 z-50 grid place-items-center p-4"
        >
            <div
                className="absolute inset-0 bg-black/50"
                onClick={closeCartPage}
                aria-hidden
            />
            <div className="relative overflow-y-auto max-h-3/4 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <h2
                        id="cart-title"
                        className="text-xl font-bold dark:text-white"
                    >
                        Your Cart
                    </h2>
                    <button
                        type="button"
                        onClick={closeCartPage}
                        className="mb-4 w-1/4 rounded bg-emerald-600 px-4 py-2 text-lg font-bold text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                        aria-label="Close cart"
                    >
                        <span aria-hidden="true">✕</span>
                    </button>
                </div>
                {cart.items.length === 0 ? (
                    <p className="mt-4 text-slate-700 dark:text-gray-300">
                        Your cart is empty.
                    </p>
                ) : (
                    <div className="mt-4 grid gap-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.variantId}
                                className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3 dark:border-gray-700"
                            >
                                <div>
                                    <p className="font-semibold dark:text-white">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-gray-400">
                                        Qty: {item.qty}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold dark:text-white">
                                        $
                                        {(item.unitPrice * item.qty).toFixed(2)}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeItem(item.variantId)
                                        }
                                        className="mt-2 text-sm underline underline-offset-4 dark:text-red-400"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between">
                            <p className="font-semibold dark:text-white">
                                Subtotal
                            </p>
                            <p className="font-bold dark:text-white">
                                {formattedTotal}
                            </p>
                        </div>
                        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900">
                            <div>
                                <label className="block font-semibold text-slate-800 dark:text-white" htmlFor="checkout-name">
                                    Customer name
                                </label>
                                <input
                                    id="checkout-name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-800 dark:text-white" htmlFor="checkout-email">
                                    Email
                                </label>
                                <input
                                    id="checkout-email"
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-800 dark:text-white" htmlFor="checkout-address">
                                    Shipping address
                                </label>
                                <input
                                    id="checkout-address"
                                    value={shippingAddress.line1}
                                    onChange={(e) =>
                                        setShippingAddress((prev) => ({
                                            ...prev,
                                            line1: e.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Street address"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <input
                                    value={shippingAddress.city}
                                    onChange={(e) =>
                                        setShippingAddress((prev) => ({
                                            ...prev,
                                            city: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="City"
                                />
                                <input
                                    value={shippingAddress.state}
                                    onChange={(e) =>
                                        setShippingAddress((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="State"
                                />
                                <input
                                    value={shippingAddress.postalCode}
                                    onChange={(e) =>
                                        setShippingAddress((prev) => ({
                                            ...prev,
                                            postalCode: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="ZIP"
                                />
                            </div>
                        </div>
                        {checkoutError && (
                            <p className="text-sm text-red-600" role="alert">
                                {checkoutError}
                            </p>
                        )}
                        {checkoutStatus && (
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                {checkoutStatus}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={async () => {
                                setCheckoutError(null)
                                setCheckoutStatus('Validating cart...')
                                try {
                                    const response = await submitCheckout({
                                        customer: {
                                            name: customerName || 'Guest',
                                            email: customerEmail,
                                        },
                                        shipping: shippingAddress,
                                    })

                                    setCheckoutStatus('Redirecting to payment...')

                                    if (response.checkoutUrl) {
                                        window.location.href = response.checkoutUrl
                                    }
                                } catch (error) {
                                    const message =
                                        error instanceof Error
                                            ? error.message
                                            : 'Checkout failed.'
                                    setCheckoutError(message)
                                    setCheckoutStatus(null)
                                }
                            }}
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                        >
                            Checkout
                        </button>
                        <p className="text-xs text-slate-600 dark:text-gray-400">
                            Secure checkout and age verification applied at
                            payment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
