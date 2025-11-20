'use client'
import React, { useEffect, useRef, useState } from 'react'
import LocalBusinessInfo from './LocalBusinessInfo'
import SearchNavigation from './SearchNavigation'
import { slugify } from '../utils/slugify'
import { scrollToSection } from '../utils/scrollToSection'

/**
 * Navigation component for the header of the website.
 *
 * @return {JSX.Element} The navigation component.
 */
function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [shouldRenderMobileMenu, setShouldRenderMobileMenu] = useState(false)
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const closeMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Handle scroll effects
    useEffect(() => {

        /**
         * Handles the scroll event and updates the state of whether the user has
         * scrolled more than 20 pixels from the top of the page.
         *
         * This function is called whenever the window is scrolled. It checks if the
         * scroll position is greater than 20 pixels from the top of the page and
         * updates the `isScrolled` state accordingly.
         *
         * @return {void} No return value.
         */
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        return () => {
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current)
            }
            if (closeMenuTimeoutRef.current) {
                clearTimeout(closeMenuTimeoutRef.current)
            }
        }
    }, [])


    /**
     * Handles mouse enter event for dropdown menus
     * @param {string} itemId - The ID of the menu item
     */
    const handleDropdownEnter = (itemId: string) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current)
            dropdownTimeoutRef.current = null
        }
        setActiveDropdown(itemId)
    }

    /**
     * Handles mouse leave event for dropdown menus with delay
     */
    const handleDropdownLeave = () => {
        const timeout = setTimeout(() => {
            setActiveDropdown(null)
        }, 600) // 600ms delay for smooth user experience
        dropdownTimeoutRef.current = timeout
    }

    // Navigation items with clear hierarchy
    const navigationItems = [
        {
            id: 'home',
            label: 'Home',
            targetId: 'home',
            icon: 'fas fa-home',
        },
        {
            id: 'products',
            label: 'Products',
            targetId: 'products',
            icon: 'fas fa-cannabis',
            submenu: [
                { label: 'Flower', category: 'Flower' },
                { label: 'Concentrates', category: 'Concentrates' },
                { label: 'Diamonds & Sauce', category: 'Diamonds & Sauce' },
                { label: 'Vapes & Carts', category: 'Vapes & Carts' },
                { label: 'Edibles', category: 'Edibles' },
                { label: 'Pre-rolls', category: 'Pre-Rolls' },
            ],
        },
        {
            id: 'about',
            label: 'About Us',
            targetId: 'about',
            icon: 'fas fa-info-circle',
        },
        {
            id: 'location',
            label: 'Visit Us',
            targetId: 'location',
            icon: 'fas fa-map-marker-alt',
        },
        {
            id: 'contact',
            label: 'Contact',
            targetId: 'contact',
            icon: 'fas fa-phone',
        },
    ]

    /**
     * Toggles the menu open and closed.
     *
     * This function toggles the value of `isMenuOpen` state. If the menu is
     * currently closed, it will be opened. If it is currently open, it will be
     * closed.
     *
     * @return {void} This function does not return anything.
     */
    const openMenu = () => {
        if (closeMenuTimeoutRef.current) {
            clearTimeout(closeMenuTimeoutRef.current)
            closeMenuTimeoutRef.current = null
        }
        if (!shouldRenderMobileMenu) {
            setShouldRenderMobileMenu(true)
        }
        setIsMenuOpen(true)
    }

    const toggleMenu = () => {
        if (isMenuOpen) {
            closeMenu()
        } else {
            openMenu()
        }
    }

    /**
     * Closes the menu by setting the `isMenuOpen` state to `false`.
     *
     * @return {void} This function does not return anything.
     */
    const closeMenu = () => {
        setIsMenuOpen(false)
        if (closeMenuTimeoutRef.current) {
            clearTimeout(closeMenuTimeoutRef.current)
        }
        closeMenuTimeoutRef.current = setTimeout(() => {
            setShouldRenderMobileMenu(false)
            closeMenuTimeoutRef.current = null
        }, 300)
    }

    /**
     * Handles a click on a navigation link.
     *
     * @param {Event} e - The click event.
     * @param {string} href - The href of the link that was clicked.
     * @param {string} id - The id of the link that was clicked.
     * @return {void} This function does not return anything.
     */
    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string,
        id: string,
        options?: { categorySlug?: string; categoryName?: string }
    ) => {
        e.preventDefault()
        setActiveSection(id)
        closeMenu()

        const slugFromOptions =
            options?.categorySlug ||
            (options?.categoryName ? slugify(options.categoryName) : undefined)

        if (slugFromOptions && typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('products:select-category', {
                    detail: {
                        categorySlug: slugFromOptions,
                        categoryName: options?.categoryName,
                    },
                })
            )
        }

        scrollToSection(targetId)
    }

    const mobileMenuAriaHidden = !isMenuOpen && !shouldRenderMobileMenu ? true : undefined
    const mobileMenuItemTabIndex = isMenuOpen ? 0 : -1

    return (
        <>
            {/* Main Navigation Header */}
            <header
                id="navigation"
                className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${isScrolled
                        ? 'glass dark:glass-dark shadow-theme-md py-2'
                        : 'bg-transparent py-4'
                    }`}
            >
                <nav role="navigation" aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <span className="flex items-center space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                                    <i
                                        className="fas fa-cannabis text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        Route 66 Hemp
                                    </span>
                                    <div className="text-xs text-gray-600 dark:text-gray-300">
                                        St Robert, MO
                                    </div>
                                </div>
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navigationItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative"
                                        onMouseEnter={() => item.submenu && handleDropdownEnter(item.id)}
                                        onMouseLeave={() => item.submenu && handleDropdownLeave()}
                                    >
                                        <a
                                            href={`#${item.targetId}`}
                                            onClick={(e) =>
                                                handleNavClick(
                                                    e,
                                                    item.targetId,
                                                    item.id
                                                )
                                            }
                                            aria-current={
                                                activeSection === item.id
                                                    ? 'page'
                                                    : undefined
                                            }
                                            aria-haspopup={
                                                item.submenu
                                                    ? 'true'
                                                    : undefined
                                            }
                                            aria-expanded={
                                                item.submenu
                                                    ? activeDropdown === item.id ? 'true' : 'false'
                                                    : undefined
                                            }
                                            className={`focus-enhanced flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === item.id
                                                    ? 'bg-green-700 text-white'
                                                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-green-300'
                                                }`}
                                        >
                                            <i
                                                className={`${item.icon} mr-2 text-sm auto-contrast`}
                                                aria-hidden="true"
                                            />
                                            {item.label}
                                            {item.submenu && (
                                                <i
                                                    className={`fas fa-chevron-down ml-1 text-xs transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''
                                                        }`}
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </a>

                                        {/* Desktop Dropdown */}
                                        {item.submenu && (
                                            <div
                                                className={`absolute left-0 mt-2 w-48 font-bold rounded-xl glass dark:glass-dark shadow-theme-xl ring-1 ring-black/5 transition-all duration-300 ${activeDropdown === item.id
                                                        ? 'visible opacity-100 translate-y-0'
                                                        : 'invisible opacity-0 -translate-y-2 pointer-events-none'
                                                    }`}
                                                role="menu"
                                                aria-label={`${item.label} submenu`}
                                            >
                                                <div
                                                    className="flex flex-col py-1 font-semibold"
                                                    role="none"
                                                >
                                                    {item.submenu.map((subItem) => {
                                                        const categorySlug = slugify(
                                                            subItem.category
                                                        )
                                                        return (
                                                            <a
                                                                key={
                                                                    subItem.label
                                                                }
                                                                href="#products"
                                                                onClick={(e) =>
                                                                    handleNavClick(
                                                                        e,
                                                                        'products',
                                                                        item.id,
                                                                        {
                                                                            categorySlug,
                                                                            categoryName:
                                                                                subItem.category,
                                                                        }
                                                                    )
                                                                }
                                                                className="block px-4 py-2 text-black dark:text-gray-300 hover:bg-green-100 hover:text-green-700 dark:hover:bg-gray-700 dark:hover:text-green-300"
                                                                role="menuitem"
                                                            >
                                                                {
                                                                    subItem.label
                                                                }
                                                            </a>
                                                        )
                                                    }
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info & Mobile Menu Button */}
                        <div className="flex items-center space-x-4">
                            {/* Search Component */}
                            <SearchNavigation />

                            {/* Quick Contact (Desktop) */}
                            <div className="hidden items-center space-x-4 text-sm lg:flex">
                                <a
                                    href="tel:+15736776418"
                                    className="flex items-center text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                                >
                                    <i
                                        className="fas fa-phone mr-1"
                                        aria-hidden="true"
                                    />
                                    (573) 677-6418
                                </a>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                type="button"
                                onClick={toggleMenu}
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
                                className="focus-enhanced inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-green-100 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 md:hidden dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-green-300"
                            >
                                <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                                <i
                                    className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Navigation Menu */}
                <div
                    className={"transition-all duration-300 ease-in-out md:hidden " + (isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0')}
                    id="mobile-menu"
                    aria-hidden={mobileMenuAriaHidden}
                >
                    {shouldRenderMobileMenu && (
                        <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigationItems.map((item) => (
                                    <div key={item.id}>
                                        <a
                                            href={'#' + item.targetId}
                                            onClick={(e) =>
                                                handleNavClick(
                                                    e,
                                                    item.targetId,
                                                    item.id
                                                )
                                            }
                                            aria-current={
                                                activeSection === item.id
                                                    ? 'page'
                                                    : undefined
                                            }
                                            tabIndex={mobileMenuItemTabIndex}
                                            className={`focus-enhanced flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors ${activeSection === item.id
                                                    ? 'bg-green-700 text-white'
                                                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-green-300'
                                                }`}
                                        >
                                            <i
                                                className={`${item.icon} mr-3`}
                                                aria-hidden="true"
                                            />
                                            {item.label}
                                        </a>

                                        {/* Mobile Submenu */}
                                        {item.submenu && (
                                            <div
                                                className="auto-contrast ml-6 mt-1 space-y-1"
                                                role="menu"
                                                aria-label={`${item.label} submenu`}
                                            >
                                                {item.submenu.map((subItem) => {
                                                    const categorySlug = slugify(
                                                        subItem.category
                                                    )
                                                    return (
                                                        <a
                                                            key={subItem.label}
                                                            href="#products"
                                                            onClick={(e) =>
                                                                handleNavClick(
                                                                    e,
                                                                    'products',
                                                                    item.id,
                                                                    {
                                                                        categorySlug,
                                                                        categoryName:
                                                                            subItem.category,
                                                                    }
                                                                )
                                                            }
                                                            className="focus-enhanced block px-3 py-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                            tabIndex={mobileMenuItemTabIndex}
                                                            role="menuitem"
                                                        >
                                                            {subItem.label}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Contact Info */}
                            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                                <LocalBusinessInfo
                                    variant="minimal"
                                    className="text-gray-600 dark:text-gray-300"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Spacer to prevent content from hiding behind fixed header */}
            <div className="h-16"></div>
        </>
    )
}

export default Navigation

