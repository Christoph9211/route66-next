'use client';
import React, { useMemo, useState, useRef, useEffect } from 'react'
import Script from 'next/script'
import { useCart } from '../hooks/useCart'

interface CloverInstance {
    elements: () => CloverElements
    createToken: () => Promise<CloverTokenResult>
}

interface CloverElements {
    create: (type: string, styles?: Record<string, unknown>) => CloverElement
}

interface CloverElement {
    mount: (selector: string) => void
}

interface CloverTokenResult {
    token?: string
    errors?: Record<string, string>
}

declare global {
    interface Window {
        Clover: new (apiKey: string) => CloverInstance
    }
}

interface ShippingDetails {
    firstName: string
    lastName: string
    email: string
    phone: string
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    country: string
    saveInfo: boolean
}

type Step = 1 | 2 | 3



const initialShipping: ShippingDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    saveInfo: true,
}

function validateShipping(details: ShippingDetails) {
    const errors: Partial<Record<keyof ShippingDetails, string>> = {}
    if (!details.firstName.trim()) errors.firstName = 'First name is required'
    if (!details.lastName.trim()) errors.lastName = 'Last name is required'
    if (!details.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        errors.email = 'Enter a valid email'
    if (!details.phone.match(/^\+?[0-9]{7,}$/))
        errors.phone = 'Phone number should have at least 7 digits'
    if (!details.address1.trim()) errors.address1 = 'Street address is required'
    if (!details.city.trim()) errors.city = 'City is required'
    if (!details.state.trim()) errors.state = 'State is required'
    if (!details.postalCode.match(/^[0-9]{5}(-[0-9]{4})?$/))
        errors.postalCode = 'Use a 5-digit ZIP (or ZIP+4)'
    if (!details.country.trim()) errors.country = 'Country is required'
    return errors
}

/**
 * Renders the cart page with multi-step checkout.
 *
 * @return {JSX.Element|null} The cart page component or null if the page is not open.
 */
export default function CartPage() {
    const {
        cart,
        isPageOpen,
        closeCartPage,
        removeItem,
        clearCart,
        submitCheckout,
    } = useCart()
    const [step, setStep] = useState<Step>(1)
    const [shipping, setShipping] = useState<ShippingDetails>(initialShipping)
    const [shippingErrors, setShippingErrors] = useState<
        Partial<Record<keyof ShippingDetails, string>>
    >({})
    const [paymentToken, setPaymentToken] = useState<string | null>(null)
    const [statusMessage, setStatusMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [confirmation, setConfirmation] = useState<
        { orderNumber: string; estimatedShipDate?: string } | null
    >(null)
    const [isAutofilled, setIsAutofilled] = useState(false)
    const [isCloverReady, setIsCloverReady] = useState(false)
    const cloverRef = useRef<CloverInstance | null>(null)
    const elementsRef = useRef<CloverElements | null>(null)
    const walletsAvailable = true
    const stepHeadingRef = useRef<HTMLHeadingElement>(null)

    const formattedTotal = useMemo(
        () => `${cart.currency || 'USD'} ${cart.total.toFixed(2)}`,
        [cart.currency, cart.total]
    )

    // Helper functions restored
    const handleClose = () => {
        closeCartPage()
        setStep(1)
    }

    const proceedToStep = (newStep: Step) => {
        if (newStep === 3 && step === 2) {
            const errors = validateShipping(shipping)
            if (Object.keys(errors).length > 0) {
                setShippingErrors(errors)
                return
            }
            setShippingErrors({})
        }
        setStep(newStep)
    }

    const autofill = () => {
        setShipping({
            ...initialShipping,
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            phone: '555-0123',
            address1: '123 Main St',
            city: 'Austin',
            state: 'TX',
            postalCode: '73301',
            country: 'US',
        })
        setIsAutofilled(true)
    }

    const tokenizePayment = async () => {
        if (!cloverRef.current) return null

        return new Promise<string>((resolve, reject) => {
            cloverRef.current!.createToken()
                .then((result: CloverTokenResult) => {
                    if (result.errors) {
                        const errorMsg = Object.values(result.errors).join(', ')
                        setStatusMessage(`Payment error: ${errorMsg}`)
                        reject(new Error(errorMsg))
                    } else if (result.token) {
                        setPaymentToken(result.token)
                        resolve(result.token)
                    }
                })
                .catch((err: Error) => {
                    setStatusMessage('Payment processing failed')
                    reject(err)
                })
        })
    }

    const handlePlaceOrder = async () => {
        setIsSubmitting(true)
        setStatusMessage('Processing payment...')

        try {
            const token = await tokenizePayment()
            if (!token) {
                setIsSubmitting(false)
                return
            }

            setStatusMessage('Placing order...')
            const response = await submitCheckout({
                customer: {
                    name: `${shipping.firstName} ${shipping.lastName}`,
                    email: shipping.email,
                    phone: shipping.phone
                },
                shipping: {
                    line1: shipping.address1,
                    line2: shipping.address2,
                    city: shipping.city,
                    state: shipping.state,
                    postalCode: shipping.postalCode,
                    country: shipping.country
                },
                source: token
            })

            setConfirmation({
                orderNumber: response.orderId,
                estimatedShipDate: new Date(Date.now() + 86400000 * 2).toISOString()
            })
            clearCart()
            // Stay on step 3 but confirmation will render
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'Checkout failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (step === 3 && window.Clover && !cloverRef.current) {
            const apiKey = process.env.NEXT_PUBLIC_CLOVER_PUBLISHABLE_KEY
            if (!apiKey) {
                console.error('Missing Clover Publishable Key')
                setStatusMessage('Configuration error: Missing Payment Key')
                return
            }

            try {
                const clover = new window.Clover(apiKey)
                cloverRef.current = clover
                const elements = clover.elements()
                elementsRef.current = elements

                const styles = {
                    body: {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                    },
                    input: {
                        color: '#334155', // slate-700
                    }
                }

                elements.create('CARD_NUMBER', styles).mount('#clover-card-number')
                elements.create('CARD_DATE', styles).mount('#clover-card-exp')
                elements.create('CARD_CVV', styles).mount('#clover-card-cvv')
                elements.create('CARD_POSTAL_CODE', styles).mount('#clover-card-postal')

                setIsCloverReady(true)
            } catch (error) {
                console.error('Clover init error', error)
                setStatusMessage('Failed to load payment fields')
            }
        } else if (step !== 3) {
            cloverRef.current = null
            elementsRef.current = null
            setIsCloverReady(false)
        }
    }, [step])

    const shippingCost: number = 0
    const tax = cart.total * 0.08
    const total = cart.total + shippingCost + tax

    if (!isPageOpen) return null

    const renderStepIndicator = () => (
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600 dark:text-gray-300">
            {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-base ${step === index
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/60'
                            : 'border-slate-300 text-slate-500 dark:border-gray-600 dark:text-gray-300'
                            }`}
                        aria-current={step === index}
                    >
                        {index}
                    </div>
                    <span className="hidden sm:inline">
                        {index === 1
                            ? 'Review'
                            : index === 2
                                ? 'Shipping & Contact'
                                : 'Payment'}
                    </span>
                    {index < 3 && <span className="text-slate-400">➜</span>}
                </div>
            ))}
        </div>
    )

    const renderCartReview = () => (
        <div className="space-y-4" aria-live="polite">
            {cart.items.map((item) => (
                <div
                    key={item.variantId}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-3 shadow-sm dark:border-gray-700"
                >
                    <div>
                        <p className="font-semibold dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                            Qty: {item.qty}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                            ${item.unitPrice.toFixed(2)} each
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold dark:text-white">
                            ${(item.unitPrice * item.qty).toFixed(2)}
                        </p>
                        <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            className="mt-2 text-sm underline underline-offset-4 dark:text-red-400"
                            aria-label={`Remove ${item.name}`}
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-inner dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                Double-check quantities and discounts before continuing. Taxes and
                shipping are calculated next.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={handleClose}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-gray-600 dark:text-white"
                >
                    Continue shopping
                </button>
                <button
                    type="button"
                    onClick={() => proceedToStep(2)}
                    className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-center font-semibold text-white shadow hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    disabled={cart.items.length === 0}
                >
                    Continue to shipping
                </button>
            </div>
        </div>
    )

    const renderShippingForm = () => (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <label className="flex-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                    First name
                    <input
                        aria-invalid={!!shippingErrors.firstName}
                        aria-describedby="first-name-error"
                        value={shipping.firstName}
                        onChange={(e) =>
                            setShipping({ ...shipping, firstName: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {shippingErrors.firstName && (
                        <span
                            id="first-name-error"
                            className="mt-1 block text-xs text-red-500"
                            aria-live="assertive"
                        >
                            {shippingErrors.firstName}
                        </span>
                    )}
                </label>
                <label className="flex-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Last name
                    <input
                        aria-invalid={!!shippingErrors.lastName}
                        aria-describedby="last-name-error"
                        value={shipping.lastName}
                        onChange={(e) =>
                            setShipping({ ...shipping, lastName: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {shippingErrors.lastName && (
                        <span
                            id="last-name-error"
                            className="mt-1 block text-xs text-red-500"
                            aria-live="assertive"
                        >
                            {shippingErrors.lastName}
                        </span>
                    )}
                </label>
            </div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Email
                <input
                    type="email"
                    aria-invalid={!!shippingErrors.email}
                    aria-describedby="email-error"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                {shippingErrors.email && (
                    <span
                        id="email-error"
                        className="mt-1 block text-xs text-red-500"
                        aria-live="assertive"
                    >
                        {shippingErrors.email}
                    </span>
                )}
            </label>
            <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Phone
                <input
                    type="tel"
                    aria-invalid={!!shippingErrors.phone}
                    aria-describedby="phone-error"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                {shippingErrors.phone && (
                    <span
                        id="phone-error"
                        className="mt-1 block text-xs text-red-500"
                        aria-live="assertive"
                    >
                        {shippingErrors.phone}
                    </span>
                )}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <label className="flex-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Street address
                    <input
                        aria-invalid={!!shippingErrors.address1}
                        aria-describedby="address1-error"
                        value={shipping.address1}
                        onChange={(e) =>
                            setShipping({ ...shipping, address1: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {shippingErrors.address1 && (
                        <span
                            id="address1-error"
                            className="mt-1 block text-xs text-red-500"
                            aria-live="assertive"
                        >
                            {shippingErrors.address1}
                        </span>
                    )}
                </label>
                <label className="flex-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Apt, suite, etc. (optional)
                    <input
                        value={shipping.address2}
                        onChange={(e) =>
                            setShipping({ ...shipping, address2: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                </label>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <label className="flex-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                    ZIP code
                    <input
                        aria-invalid={!!shippingErrors.postalCode}
                        aria-describedby="postal-error"
                        value={shipping.postalCode}
                        onChange={(e) =>
                            setShipping({ ...shipping, postalCode: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {shippingErrors.postalCode && (
                        <span
                            id="postal-error"
                            className="mt-1 block text-xs text-red-500"
                            aria-live="assertive"
                        >
                            {shippingErrors.postalCode}
                        </span>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                        ZIP auto-fills city/state where available.
                    </p>
                </label>
                <label className="flex-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                    City
                    <input
                        aria-invalid={!!shippingErrors.city}
                        aria-describedby="city-error"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {shippingErrors.city && (
                        <span
                            id="city-error"
                            className="mt-1 block text-xs text-red-500"
                            aria-live="assertive"
                        >
                            {shippingErrors.city}
                        </span>
                    )}
                </label>
                <label className="flex-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                    State
                    <input
                        aria-invalid={!!shippingErrors.state}
                        aria-describedby="state-error"
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {shippingErrors.state && (
                        <span
                            id="state-error"
                            className="mt-1 block text-xs text-red-500"
                            aria-live="assertive"
                        >
                            {shippingErrors.state}
                        </span>
                    )}
                </label>
            </div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Country
                <input
                    aria-invalid={!!shippingErrors.country}
                    aria-describedby="country-error"
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                {shippingErrors.country && (
                    <span
                        id="country-error"
                        className="mt-1 block text-xs text-red-500"
                        aria-live="assertive"
                    >
                        {shippingErrors.country}
                    </span>
                )}
            </label>
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={autofill}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-gray-600 dark:text-white"
                >
                    Autofill my info
                </button>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-200">
                    <input
                        type="checkbox"
                        checked={shipping.saveInfo}
                        onChange={(e) =>
                            setShipping({ ...shipping, saveInfo: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 dark:border-gray-600"
                    />
                    Save details for next time
                </label>
                {isAutofilled && (
                    <span className="text-xs text-emerald-700 dark:text-emerald-400" aria-live="polite">
                        Autofill applied
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-gray-600 dark:text-white"
                >
                    Back to review
                </button>
                <button
                    type="button"
                    onClick={() => proceedToStep(3)}
                    className="rounded-2xl bg-emerald-700 px-4 py-3 text-center font-semibold text-white shadow hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                    Continue to payment
                </button>
            </div>
        </form>
    )

    const renderPayment = () => (
        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-gray-700">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Card payment (Clover hosted fields)
                    </h3>
                    {isCloverReady ? (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Secure & PCI compliant
                        </span>
                    ) : (
                        <span className="text-xs font-semibold text-amber-600">
                            Initializing Clover...
                        </span>
                    )}
                </div>
                <div className="mt-3 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div
                            id="clover-card-number"
                            className="flex h-12 items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-inner dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            aria-label="Card number"
                        >
                            <span>Card number</span>
                            <span className="text-slate-400">•••• •••• •••• 1234</span>
                        </div>
                        <div
                            id="clover-card-exp"
                            className="flex h-12 items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-inner dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            aria-label="Expiration"
                        >
                            <span>MM/YY</span>
                            <span className="text-slate-400">12/28</span>
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div
                            id="clover-card-cvv"
                            className="flex h-12 items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-inner dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            aria-label="Security code"
                        >
                            <span>CVV</span>
                            <span className="text-slate-400">•••</span>
                        </div>
                        <div
                            id="clover-card-postal"
                            className="flex h-12 items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-inner dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            aria-label="Billing ZIP"
                        >
                            <span>Billing ZIP</span>
                            <span className="text-slate-400">{shipping.postalCode || 'Required'}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={tokenizePayment}
                        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    >
                        Tokenize with Clover
                    </button>
                    <p className="text-xs text-slate-600 dark:text-gray-400">
                        We tokenize your card via Clover’s PCI-compliant hosted fields. No
                        card data touches our servers.
                    </p>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Express checkout
                    </h3>
                    {walletsAvailable && (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Apple Pay / Google Pay
                        </span>
                    )}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                        aria-label="Pay with Apple Pay"
                    >
                         Pay
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                        aria-label="Pay with Google Pay"
                    >
                        <span className="text-lg">G</span> Pay
                    </button>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-400">
                    Wallet availability depends on your device and browser support.
                </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-gray-600 dark:text-white"
                >
                    Back to shipping
                </button>
                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="rounded-2xl bg-emerald-700 px-4 py-3 text-center font-semibold text-white shadow hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-400"
                    disabled={isSubmitting || cart.items.length === 0}
                >
                    {isSubmitting ? 'Submitting...' : 'Place order securely'}
                </button>
            </div>
            {statusMessage && (
                <p className="text-sm text-emerald-700 dark:text-emerald-400" aria-live="polite">
                    {statusMessage}
                </p>
            )}
            {paymentToken && (
                <p className="text-xs text-slate-600 dark:text-gray-400" aria-live="polite">
                    Token ready: {paymentToken}
                </p>
            )}
        </div>
    )

    const renderConfirmation = () => (
        <div className="space-y-4" aria-live="polite">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-50">
                <h3
                    className="text-2xl font-bold"
                    tabIndex={-1}
                    ref={stepHeadingRef}
                    aria-label="Order confirmed"
                >
                    Order confirmed
                </h3>
                <p className="mt-2 text-sm">
                    Thank you! Your order <strong>{confirmation?.orderNumber}</strong>
                    {' '}is confirmed. We also emailed you a receipt and next steps.
                </p>
                {confirmation?.estimatedShipDate && (
                    <p className="mt-1 text-sm">
                        Estimated ship date: {new Date(confirmation.estimatedShipDate).toLocaleDateString()}
                    </p>
                )}
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-gray-700">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                    What happens next?
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-gray-300">
                    <li>Track your order from your account or email link.</li>
                    <li>We will send shipping updates as soon as a label is created.</li>
                    <li>Need changes? Reply to your confirmation email within 30 minutes.</li>
                </ul>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-gray-600 dark:text-white"
                >
                    Keep shopping
                </button>
                <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-2xl bg-emerald-700 px-4 py-3 text-center font-semibold text-white shadow hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                    View order summary
                </button>
            </div>
        </div>
    )

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
                onClick={handleClose}
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

                        {renderStepIndicator()}
                        <div className="mt-4 rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-gray-700">
                            {confirmation
                                ? renderConfirmation()
                                : step === 1
                                    ? renderCartReview()
                                    : step === 2
                                        ? renderShippingForm()
                                        : renderPayment()}
                        </div>
                        <aside className="md:col-span-1">
                            <div className="sticky top-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                    Order summary
                                </h3>
                                <div className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Items ({cart.items.length})</span>
                                        <span>${cart.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>
                                            {shippingCost === 0
                                                ? 'Free'
                                                : `$${shippingCost.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated tax</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold dark:border-gray-700">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-gray-400">
                                        Taxes and shipping update in real time once you enter your
                                        address.
                                    </p>
                                </div>
                                {step === 1 && (
                                    <button
                                        type="button"
                                        onClick={() => proceedToStep(2)}
                                        className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-center font-semibold text-white shadow hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                        disabled={cart.items.length === 0}
                                    >
                                        Start checkout
                                    </button>
                                )}
                                {statusMessage && step !== 3 && (
                                    <div
                                        className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100"
                                        role="status"
                                    >
                                        {statusMessage}
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                )}
            </div>
            <Script
                src="https://checkout.clover.com/sdk.js"
                strategy="lazyOnload"
                onLoad={() => {
                    // Trigger re-render or effect if needed, but effect checks window.Clover
                    if (step === 3) {
                        // Force update or just let the effect run if it depends on something else?
                        // Actually, we can just toggle a dummy state or rely on the user navigating.
                        // But better:
                        if (step === 3 && !cloverRef.current) {
                            // Re-trigger effect
                            setStep(3)
                        }
                    }
                }}
            />
        </div>
    )
}
