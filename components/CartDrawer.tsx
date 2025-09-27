'use client';
import React, { useEffect, useRef } from 'react'
import { useCart } from '../hooks/useCart'

/**
 * Renders the shopping cart drawer component.
 *
 * @return {JSX.Element} The shopping cart drawer component.
 */
export default function CartDrawer() {
    const { cart, isOpen, closeCart, openCartPage } = useCart()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {


        /**
         * Handles the 'Escape' key event by closing the cart.
         *
         * @param {KeyboardEvent} e - The keyboard event.
         * @return {void} This function does not return anything.
         */
        const handleEsc = (e: { key: string; }) => {
            if (e.key === 'Escape') closeCart()
        }
        if (isOpen) document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, closeCart])

    useEffect(() => {
        if (isOpen) {
            ref.current?.focus()
        }
    }, [isOpen])

    const itemCount = cart.items.reduce((sum, i) => sum + i.qty, 0)

    return (
        <div
            className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
        >
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={closeCart}
            />
            <div
                ref={ref}
                tabIndex={-1}
                className={`absolute right-0 top-16 h-3/4 w-80 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg text-black dark:text-white font-semibold">
                        Cart ({itemCount})
                    </h2>
                    <button
                        type="button"
                        onClick={closeCart}
                        aria-label="Close cart"
                        className="mb-4 w-1/4 rounded bg-emerald-600 px-4 py-2 text-lg font-bold text-white dark:text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                        <span aria-hidden="true">✕</span>
                    </button>
                </div>
                <div className="flex h-full flex-col justify-between">
                    <ul className="flex-1 overflow-y-auto p-4">
                        {cart.items.length === 0 && (
                            <li className="text-center text-gray-700 text-sm dark:text-gray-200">
                                Your cart is empty.
                            </li>
                        )}
                        {cart.items.map((item) => (
                            <li
                                key={item.variantId}
                                className="mb-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        $
                                        {(item.unitPrice * item.qty).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="px-2 font-semibold text-gray-900 dark:text-white"
                                        onClick={() =>
                                            window.dispatchEvent(
                                                new CustomEvent('cart:update', {
                                                    detail: {
                                                        variantId:
                                                            item.variantId,
                                                        qty: item.qty - 1,
                                                    },
                                                })
                                            )
                                        }
                                        aria-label={`Decrease quantity of ${item.name}`}
                                    >
                                        <span aria-hidden="true">-</span>
                                    </button>
                                    <span className="font-semibold text-gray-900 dark:text-white">{item.qty}</span>
                                    <button
                                        type="button"
                                        className="px-2 text-gray-900 dark:text-white"
                                        onClick={() =>
                                            window.dispatchEvent(
                                                new CustomEvent('cart:update', {
                                                    detail: {
                                                        variantId:
                                                            item.variantId,
                                                        qty: item.qty + 1,
                                                    },
                                                })
                                            )
                                        }
                                        aria-label={`Increase quantity of ${item.name}`}
                                    >
                                        <span aria-hidden="true">+</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="text-red-600"
                                        onClick={() =>
                                            window.dispatchEvent(
                                                new CustomEvent('cart:remove', {
                                                    detail: {
                                                        variantId:
                                                            item.variantId,
                                                    },
                                                })
                                            )
                                        }
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t bg-white dark:bg-gray-800 p-4">
                        <button
                            type="button"
                            className="mb-4 w-full rounded bg-emerald-700 px-4 py-2 text-lg font-bold text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
                            onClick={openCartPage}
                        >
                            View Cart
                        </button>
                        <div className="flex justify-between">
                            <span className="text-gray-900 dark:text-white">Subtotal</span>
                            <span className="text-gray-900 dark:text-white">${cart.subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
