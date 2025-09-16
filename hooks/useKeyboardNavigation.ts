@@ .. @@
 'use client';
 import { useState, useEffect } from 'react'
+import { useRouter } from 'next/navigation'

 /**
  * Custom hook that provides navigation functionality for the page.
@@ .. @@
 export function useNavigation() {
     const [activeSection, setActiveSection] = useState('home')
     const [isScrolled, setIsScrolled] = useState(false)
+    const [focusedElement, setFocusedElement] = useState<string | null>(null)

     useEffect(() => {
@@ .. @@
         activeSection,
         isScrolled,
         navigateToSection,
-        setActiveSection
+        setActiveSection,
+        focusedElement,
+        setFocusedElement
     }
 }

 /**
  * Hook for handling keyboard navigation.
@@ .. @@
  */
 export function useKeyboardNavigation() {
+    const router = useRouter()
+    
     useEffect(() => {
     /**
      * Handles keydown events and performs actions based on the key pressed.
@@ .. @@
      */
         const handleKeyDown = (event: KeyboardEvent) => {
             const target = event.target as HTMLElement
+            const activeElement = document.activeElement as HTMLElement
+            
             // Skip if user is typing in an input
-            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
+            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                 return
             }

             switch (event.key) {
                 case '1':
+                    event.preventDefault()
                     document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
+                    // Focus the first interactive element in home section
+                    setTimeout(() => {
+                        const homeSection = document.getElementById('home')
+                        const firstFocusable = homeSection?.querySelector('a, button, [tabindex]:not([tabindex="-1"])')
+                        if (firstFocusable) (firstFocusable as HTMLElement).focus()
+                    }, 500)
                     break
                 case '2':
+                    event.preventDefault()
                     document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
+                    setTimeout(() => {
+                        const productsSection = document.getElementById('products')
+                        const firstFocusable = productsSection?.querySelector('a, button, [tabindex]:not([tabindex="-1"])')
+                        if (firstFocusable) (firstFocusable as HTMLElement).focus()
+                    }, 500)
                     break
                 case '3':
+                    event.preventDefault()
                     document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                     break
                 case '4':
+                    event.preventDefault()
                     document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })
                     break
                 case '5':
+                    event.preventDefault()
                     document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                     break
+                case 'Tab':
+                    // Enhanced tab navigation - ensure proper focus order
+                    if (!event.shiftKey) {
+                        // Forward tab - check if we need to skip to next section
+                        const currentSection = getCurrentSection(activeElement)
+                        if (currentSection && isLastFocusableInSection(activeElement, currentSection)) {
+                            const nextSection = getNextSection(currentSection)
+                            if (nextSection) {
+                                event.preventDefault()
+                                focusFirstInSection(nextSection)
+                            }
+                        }
+                    } else {
+                        // Backward tab (Shift+Tab)
+                        const currentSection = getCurrentSection(activeElement)
+                        if (currentSection && isFirstFocusableInSection(activeElement, currentSection)) {
+                            const prevSection = getPreviousSection(currentSection)
+                            if (prevSection) {
+                                event.preventDefault()
+                                focusLastInSection(prevSection)
+                            }
+                        }
+                    }
+                    break
+                case 'Enter':
+                case ' ':
+                    // Enhanced enter/space handling for custom interactive elements
+                    if (activeElement.hasAttribute('data-keyboard-clickable')) {
+                        event.preventDefault()
+                        activeElement.click()
+                    }
+                    break
+                case 'ArrowDown':
+                case 'ArrowUp':
+                    // Arrow key navigation for menus and lists
+                    if (activeElement.getAttribute('role') === 'menuitem' || 
+                        activeElement.closest('[role="menu"]') ||
+                        activeElement.closest('.product-grid')) {
+                        event.preventDefault()
+                        navigateWithArrows(event.key, activeElement)
+                    }
+                    break
                 case 'Escape':
-                    // Close any open menus
+                    // Enhanced escape handling
+                    event.preventDefault()
+                    closeAllModals()
+                    // Return focus to trigger element if available
+                    const triggerElement = document.querySelector('[data-modal-trigger]')
+                    if (triggerElement) {
+                        (triggerElement as HTMLElement).focus()
+                    }
+                    break
+                case 'Home':
+                    // Jump to first focusable element in current section
+                    event.preventDefault()
+                    const currentSection = getCurrentSection(activeElement)
+                    if (currentSection) {
+                        focusFirstInSection(currentSection)
+                    }
+                    break
+                case 'End':
+                    // Jump to last focusable element in current section
+                    event.preventDefault()
+                    const currentSectionEnd = getCurrentSection(activeElement)
+                    if (currentSectionEnd) {
+                        focusLastInSection(currentSectionEnd)
+                    }
+                    break
+                default:
+                    break
+            }
+        }
+
+        // Helper functions for enhanced keyboard navigation
+        const getCurrentSection = (element: HTMLElement): string | null => {
+            const section = element.closest('section')
+            return section?.id || null
+        }
+
+        const getNextSection = (currentSection: string): string | null => {
+            const sections = ['home', 'products', 'about', 'location', 'contact', 'faq']
+            const currentIndex = sections.indexOf(currentSection)
+            return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null
+        }
+
+        const getPreviousSection = (currentSection: string): string | null => {
+            const sections = ['home', 'products', 'about', 'location', 'contact', 'faq']
+            const currentIndex = sections.indexOf(currentSection)
+            return currentIndex > 0 ? sections[currentIndex - 1] : null
+        }
+
+        const focusFirstInSection = (sectionId: string) => {
+            const section = document.getElementById(sectionId)
+            const firstFocusable = section?.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
+            if (firstFocusable) (firstFocusable as HTMLElement).focus()
+        }
+
+        const focusLastInSection = (sectionId: string) => {
+            const section = document.getElementById(sectionId)
+            const focusableElements = section?.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
+            if (focusableElements && focusableElements.length > 0) {
+                (focusableElements[focusableElements.length - 1] as HTMLElement).focus()
+            }
+        }
+
+        const isFirstFocusableInSection = (element: HTMLElement, sectionId: string): boolean => {
+            const section = document.getElementById(sectionId)
+            const firstFocusable = section?.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
+            return element === firstFocusable
+        }
+
+        const isLastFocusableInSection = (element: HTMLElement, sectionId: string): boolean => {
+            const section = document.getElementById(sectionId)
+            const focusableElements = section?.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
+            if (focusableElements && focusableElements.length > 0) {
+                return element === focusableElements[focusableElements.length - 1]
+            }
+            return false
+        }
+
+        const navigateWithArrows = (key: string, activeElement: HTMLElement) => {
+            const container = activeElement.closest('[role="menu"], .product-grid, .responsive-grid')
+            if (!container) return
+
+            const focusableElements = Array.from(container.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
+            const currentIndex = focusableElements.indexOf(activeElement)
+            
+            if (currentIndex === -1) return
+
+            let nextIndex: number
+            if (key === 'ArrowDown') {
+                nextIndex = currentIndex + 1
+                if (nextIndex >= focusableElements.length) nextIndex = 0
+            } else {
+                nextIndex = currentIndex - 1
+                if (nextIndex < 0) nextIndex = focusableElements.length - 1
+            }
+
+            (focusableElements[nextIndex] as HTMLElement).focus()
+        }
+
+        const closeAllModals = () => {
+            // Close any open menus
+            const openMenus = document.querySelectorAll('[data-menu-open="true"]')
+            openMenus.forEach(menu => {
+                (menu as HTMLElement).click()
+            })
+            
+            // Close search overlay
+            const searchOverlay = document.querySelector('[data-search-overlay]')
+            if (searchOverlay) {
+                const closeButton = searchOverlay.querySelector('[data-close-search]')
+                if (closeButton) (closeButton as HTMLElement).click()
+            }
+            
+            // Close cart drawer
+            const cartDrawer = document.querySelector('[data-cart-drawer]')
+            if (cartDrawer && cartDrawer.classList.contains('translate-x-0')) {
+                const closeButton = cartDrawer.querySelector('[data-close-cart]')
+                if (closeButton) (closeButton as HTMLElement).click()
+            }
+        }
+
+        // Focus management for dynamic content
+        const handleFocusIn = (event: FocusEvent) => {
+            const target = event.target as HTMLElement
+            
+            // Announce section changes to screen readers
+            const section = target.closest('section')
+            if (section && section.id) {
+                const announcement = `Navigated to ${section.id} section`
+                announceToScreenReader(announcement)
+            }
+        }
+
+        const announceToScreenReader = (message: string) => {
+            const announcer = document.getElementById('sr-announcer')
+            if (announcer) {
+                announcer.textContent = message
+                setTimeout(() => {
+                    announcer.textContent = ''
+                }, 1000)
+            }
+        }
+
+        // Add event listeners
+        window.addEventListener('keydown', handleKeyDown)
+        document.addEventListener('focusin', handleFocusIn)
+        
+        return () => {
+            window.removeEventListener('keydown', handleKeyDown)
+            document.removeEventListener('focusin', handleFocusIn)
+        }
+    }, [router])
+}
+
+/**
+ * Hook for managing focus trapping in modals and overlays
+ */
+export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
+    useEffect(() => {
+        if (!isActive || !containerRef.current) return
+
+        const container = containerRef.current
+        const focusableElements = container.querySelectorAll(
+            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
+        )
+        
+        if (focusableElements.length === 0) return
+
+        const firstElement = focusableElements[0] as HTMLElement
+        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
+
+        const handleTabKey = (event: KeyboardEvent) => {
+            if (event.key !== 'Tab') return
+
+            if (event.shiftKey) {
+                if (document.activeElement === firstElement) {
+                    event.preventDefault()
+                    lastElement.focus()
+                }
+            } else {
+                if (document.activeElement === lastElement) {
+                    event.preventDefault()
+                    firstElement.focus()
+                }
+            }
+        }
+
+        // Focus first element when trap becomes active
+        firstElement.focus()
+
+        container.addEventListener('keydown', handleTabKey)
+        return () => container.removeEventListener('keydown', handleTabKey)
+    }, [isActive, containerRef])
+}
+
+/**
+ * Hook for managing skip links
+ */
+export function useSkipLinks() {
+    useEffect(() => {
+        const skipLinks = document.querySelectorAll('.skip-link')
+        
+        skipLinks.forEach(link => {
+            link.addEventListener('click', (event) => {
+                event.preventDefault()
+                const targetId = (link as HTMLAnchorElement).getAttribute('href')?.substring(1)
+                if (targetId) {
+                    const target = document.getElementById(targetId)
+                    if (target) {
+                        target.focus()
+                        target.scrollIntoView({ behavior: 'smooth' })
+                    }
+                }
+            })
+        })
+    }, [])
+}