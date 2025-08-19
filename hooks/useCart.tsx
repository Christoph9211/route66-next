'use client'
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react'

interface CartItem {
    productId: string
    variantId: string
    name: string
    image: string
    unitPrice: number
    currency: string
    qty: number
}

interface Cart {
    items: CartItem[]
    subtotal: number
    total: number
}

interface CartContextType {
    cart: Cart
    addItem: (item: CartItem) => void
    updateItem: (variantId: string, qty: number) => void
    removeItem: (variantId: string) => void
    clearCart: () => void
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
    isPageOpen: boolean
    openCartPage: () => void
    closeCartPage: () => void
}

const CartContext = createContext<CartContextType>({} as CartContextType)


/**
 * Returns the initial cart data from local storage or an empty cart object if an error occurs.
 *
 * @return {Cart} An object representing the initial cart data with properties 'items' (an array of cart items), 'subtotal' (the total price of all items), and 'total' (the total price of all items). If an error occurs, returns an object with empty 'items', 'subtotal', and 'total' properties.
 */
function getInitialCart(): Cart {
    try {
        const stored = localStorage.getItem('cart')
        return stored
            ? JSON.parse(stored)
            : { items: [], subtotal: 0, total: 0 }
    } catch {
        return { items: [], subtotal: 0, total: 0 }
    }
}

/**
 * CartProvider is a context provider component that manages the cart data. It provides context with the cart data,
 * functions to add, update, remove items from the cart, and functions to open and close the cart. The cart data is
 * stored in local storage and updated when the cart is modified.
 *
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The child components.
 * @return {ReactNode} The context provider component.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState(getInitialCart)
    const [isOpen, setIsOpen] = useState(false)
    const [isPageOpen, setIsPageOpen] = useState(false)


    /**
     * Recalculates the subtotal and total price of the given array of cart items.
     *
     * @param {CartItem[]} items - An array of cart items.
     * @return {Cart} An object with properties 'items' (the original array of cart items), 'subtotal' (the total price of all items), and 'total' (the total price of all items).
     */
    const recalc = (items: CartItem[]): Cart => {
        const subtotal = items.reduce(
            (sum, item) => sum + item.unitPrice * item.qty,
            0
        )
        return { items, subtotal, total: subtotal }
    }


    /**
     * Persists the cart data to local storage.
     *
     * @param {Cart} data - The cart data object.
     * @return {void}
     */
    const persist = (data: Cart) => {
        setCart(data)
        try {
            localStorage.setItem('cart', JSON.stringify(data))
        } catch {
            /* ignore */
        }
    }

    const addItem = useCallback((item: CartItem) => {
        setCart((prev) => {
            const existing = prev.items.find(
                (i) => i.variantId === item.variantId
            )
            let items
            if (existing) {
                items = prev.items.map((i) =>
                    i.variantId === item.variantId
                        ? { ...i, qty: i.qty + item.qty }
                        : i
                )
            } else {
                items = [...prev.items, item]
            }
            const updated = recalc(items)
            persist(updated)
            return updated
        })
    }, [])

    const updateItem = useCallback((variantId: string, qty: number) => {
        setCart((prev) => {
            const items = prev.items
                .map((i) => (i.variantId === variantId ? { ...i, qty } : i))
                .filter((i) => i.qty > 0)
            const updated = recalc(items)
            persist(updated)
            return updated
        })
    }, [])

    const removeItem = useCallback((variantId: string) => {
        setCart((prev) => {
            const items = prev.items.filter((i) => i.variantId !== variantId)
            const updated = recalc(items)
            persist(updated)
            return updated
        })
    }, [])

    const clearCart = useCallback(() => {
        const empty = recalc([])
        persist(empty)
    }, [])

    useEffect(() => {
        /**
         * Adds an item to the cart and opens the cart drawer.
         *
         * @param {CustomEvent} e - The event object.
         * @return {void}
         */
        const handleAdd = (e: CustomEvent) => {
            addItem(e.detail)
            setIsOpen(true)
        }
        const handleUpdate = (e: CustomEvent) => updateItem(e.detail.variantId, e.detail.qty)
        const handleRemove = (e: CustomEvent) => removeItem(e.detail.variantId)
        const handleClear = () => clearCart()

        window.addEventListener('cart:add', handleAdd as EventListener)
        window.addEventListener('cart:update', handleUpdate as EventListener)
        window.addEventListener('cart:remove', handleRemove as EventListener)
        window.addEventListener('cart:clear', handleClear)
        return () => {
            window.removeEventListener('cart:add', handleAdd as EventListener)
            window.removeEventListener('cart:update', handleUpdate as EventListener)
            window.removeEventListener('cart:remove', handleRemove as EventListener)
            window.removeEventListener('cart:clear', handleClear)
        }
    }, [addItem, updateItem, removeItem, clearCart])

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)
    /**
     * Opens the cart page.
     *
     * @return {void}
     */
    const openCartPage = () => {
        setIsOpen(false)
        setIsPageOpen(true)
    }
    /**
     * Closes the cart page and the cart drawer.
     *
     * @return {void}
     */
    const closeCartPage = () => {
        setIsPageOpen(false)
        setIsOpen(false)
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addItem,
                updateItem,
                removeItem,
                clearCart,
                isOpen,
                openCart,
                closeCart,
                isPageOpen,
                openCartPage,
                closeCartPage,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

/**
 * Custom hook that provides the cart state and functions. It must be used
 * within a CartProvider component.
 *
 * @throws {Error} Throws an error if not used within a CartProvider.
 * @return {CartContextType} The current cart state and functions.
 */
export function useCart(): CartContextType {
    return useContext(CartContext)
}
