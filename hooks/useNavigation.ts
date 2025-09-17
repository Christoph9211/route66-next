'use client';
import { useState, useEffect } from 'react'

/**
 * Custom hook that provides navigation functionality for the page.
 *
 * Returns an object with the following properties:
 * - activeSection: The currently active section of the page, based on the user's scroll position.
 * - isScrolled: Indicates whether the user has scrolled more than 20 pixels from the top of the page.
 * - navigateToSection: Function to scroll to a specific section of the page.
 * - setActiveSection: Function to manually set the active section.
 *
 * The hook sets up an event listener for scroll events and updates the active section and scroll state accordingly.
 * The `navigateToSection` function scrolls to the specified section smoothly.
 * The `setActiveSection` function allows for manual control of the active section.
 *
 * @return {Object} An object with the activeSection, isScrolled, navigateToSection, and setActiveSection properties.
 */
export function useNavigation() {
    const [activeSection, setActiveSection] = useState('home')
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {

        /**
         * Handles the scroll event and updates the scroll state and active section.
         *
         * Updates the scroll state based on whether the user has scrolled more than 20 pixels from the top of the page.
         * Updates the active section based on the scroll position. The active section is determined by finding the
         * first element with an ID from the `sections` array whose top and bottom positions are both within
         * half of the viewport height of the top of the viewport.
         */
        const handleScroll = () => {
            // Update scroll state
            setIsScrolled(window.scrollY > 20)

            // Update active section based on scroll position
            const sections = ['home', 'products', 'about', 'location', 'contact', 'faq']
            let currentSection = 'home'

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    // Consider a section active if it's in the top half of the viewport
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        currentSection = section
                        break
                    }
                }
            }

            setActiveSection(currentSection)
        }

        // Throttle scroll events for better performance
        let ticking = false
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', throttledHandleScroll)
        handleScroll() // Initial call

        return () => window.removeEventListener('scroll', throttledHandleScroll)
    }, [])



    /**
     * Scrolls to the specified section of the page smoothly.
     *
     * @param {string} sectionId - The ID of the section to scroll to.
     * @return {void} No return value.
     */
    const navigateToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            })
        }
        setActiveSection(sectionId)
    }

    return {
        activeSection,
        isScrolled,
        navigateToSection,
        setActiveSection
    }
}

/**
 * Hook for handling keyboard navigation.
 *
 * This hook listens for keydown events and performs actions based on the key pressed.
 * The following keys are supported:
 * - '1': Scrolls to the 'home' section smoothly.
 * - '2': Scrolls to the 'products' section smoothly.
 * - '3': Scrolls to the 'about' section smoothly.
 * - '4': Scrolls to the 'location' section smoothly.
 * - '5': Scrolls to the 'contact' section smoothly.
 * - 'Escape': Closes any open menus.
 *
 * @return {void} No return value.
 */
export function useKeyboardNavigation() {
    useEffect(() => {
        const SECTION_SELECTOR = '[data-section-nav]'
        const PRODUCT_CARD_SELECTOR = '[data-product-card]'

        const getSections = () =>
            Array.from(
                document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
            )

        const focusSection = (index: number) => {
            const sections = getSections()
            const target = sections[index]
            if (!target) {
                return
            }

            target.focus({ preventScroll: true })
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }

        const moveFocusWithinGrid = (
            current: HTMLElement,
            key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
        ) => {
            const grid = current.closest('[data-product-grid]')
            if (!grid) {
                return false
            }

            const cards = Array.from(
                grid.querySelectorAll<HTMLElement>(PRODUCT_CARD_SELECTOR)
            )

            const currentIndex = cards.indexOf(current)
            if (currentIndex === -1) {
                return false
            }

            const currentRect = current.getBoundingClientRect()
            const currentCenterX = currentRect.left + currentRect.width / 2
            const currentCenterY = currentRect.top + currentRect.height / 2

            let candidate: HTMLElement | null = null
            let bestDistance = Number.POSITIVE_INFINITY

            cards.forEach((card) => {
                if (card === current) {
                    return
                }

                const rect = card.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const deltaX = centerX - currentCenterX
                const deltaY = centerY - currentCenterY

                const sameRowThreshold = currentRect.height * 0.75
                const sameColumnThreshold = currentRect.width * 0.75

                const distance = Math.hypot(deltaX, deltaY)

                switch (key) {
                    case 'ArrowRight':
                        if (deltaX > 0 && Math.abs(deltaY) <= sameRowThreshold) {
                            if (distance < bestDistance) {
                                candidate = card
                                bestDistance = distance
                            }
                        }
                        break
                    case 'ArrowLeft':
                        if (deltaX < 0 && Math.abs(deltaY) <= sameRowThreshold) {
                            if (distance < bestDistance) {
                                candidate = card
                                bestDistance = distance
                            }
                        }
                        break
                    case 'ArrowDown':
                        if (deltaY > 0 && Math.abs(deltaX) <= sameColumnThreshold) {
                            if (distance < bestDistance) {
                                candidate = card
                                bestDistance = distance
                            }
                        }
                        break
                    case 'ArrowUp':
                        if (deltaY < 0 && Math.abs(deltaX) <= sameColumnThreshold) {
                            if (distance < bestDistance) {
                                candidate = card
                                bestDistance = distance
                            }
                        }
                        break
                    default:
                        break
                }
            })

            if (!candidate) {
                switch (key) {
                    case 'ArrowRight':
                        candidate = cards[Math.min(cards.length - 1, currentIndex + 1)]
                        break
                    case 'ArrowLeft':
                        candidate = cards[Math.max(0, currentIndex - 1)]
                        break
                    case 'ArrowDown':
                        candidate = cards[Math.min(cards.length - 1, currentIndex + 1)]
                        break
                    case 'ArrowUp':
                        candidate = cards[Math.max(0, currentIndex - 1)]
                        break
                    default:
                        break
                }
            }

            if (candidate && candidate !== current) {
                candidate.focus()
                candidate.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                return true
            }

            return false
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null
            if (!target) {
                return
            }

            const tagName = target.tagName
            const isEditable =
                tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable

            if (isEditable) {
                return
            }

            if (event.key === 'Home' && !event.ctrlKey && !event.altKey && !event.metaKey) {
                const sections = getSections()
                if (sections.length) {
                    event.preventDefault()
                    focusSection(0)
                }
                return
            }

            if (event.key === 'End' && !event.ctrlKey && !event.altKey && !event.metaKey) {
                const sections = getSections()
                if (sections.length) {
                    event.preventDefault()
                    focusSection(sections.length - 1)
                }
                return
            }

            if (
                (event.key === 'ArrowUp' ||
                    event.key === 'ArrowDown' ||
                    event.key === 'ArrowLeft' ||
                    event.key === 'ArrowRight') &&
                target.matches(PRODUCT_CARD_SELECTOR)
            ) {
                const handled = moveFocusWithinGrid(
                    target,
                    event.key as 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
                )
                if (handled) {
                    event.preventDefault()
                }
                return
            }

            if (event.key === 'Escape') {
                const openDialog = document.querySelector<HTMLElement>(
                    '[data-modal][data-modal-open="true"]'
                )
                if (openDialog) {
                    const closeButton = openDialog.querySelector<HTMLElement>(
                        '[data-modal-close]'
                    )
                    if (closeButton) {
                        event.preventDefault()
                        closeButton.click()
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])
}
