/**
 * Initializes a listener on the document for click events on elements
 * with a class of 'add-to-cart'. When such an element is clicked, an
 * event is dispatched with the product details, such as the product
 * ID, variant ID, name, image, unit price, currency, and quantity.
 * The event is named 'cart:add'.
 */
export function initCartButtonListener() {
    document.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement)?.closest('.add-to-cart')
        if (!btn) return
        const detail = {
            productId: (btn as HTMLElement).dataset.productId,
            variantId: (btn as HTMLElement).dataset.variantId,
            name: (btn as HTMLElement).dataset.name,
            image: (btn as HTMLElement).dataset.image,
            unitPrice: parseFloat((btn as HTMLElement).dataset.price ?? '0'),
            currency: (btn as HTMLElement).dataset.currency,
            qty: 1,
        }
        window.dispatchEvent(new CustomEvent('cart:add', { detail }))
    })
}
