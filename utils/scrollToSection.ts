export function scrollToSection(target: string, options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false
    if (!target) return false

    const selector = target.startsWith('#') ? target : `#${target}`
    const element = document.querySelector(selector)
    if (!element) return false

    element.scrollIntoView(options)

    if (window.history && typeof window.history.replaceState === 'function') {
        const { pathname, search } = window.location
        window.history.replaceState(null, '', `${pathname}${search}`)
    }

    return true
}