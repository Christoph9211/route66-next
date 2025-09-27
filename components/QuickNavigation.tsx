import React, { useState, useEffect } from 'react'

/**
 * Renders a quick navigation component that provides quick access to
 * various sections of the page and a call button.
 *
 * The quick navigation component is visible when the user scrolls down 300px
 * from the top of the page. It displays a call button and a set of buttons
 * that navigate to different sections of the page. The active section is
 * determined by finding the first element with an ID from the sections array
 * whose top and bottom positions are both within 100px of the top of the
 * viewport.
 *
 * @return {JSX.Element} The quick navigation component.
 */
function QuickNavigation() {
    const [isVisible, setIsVisible] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const focusableTabIndex = isVisible ? 0 : -1

    const containerClasses = [
        'fixed bottom-6 right-6 z-40 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    ].join(' ')

    const quickLinks = [
        { id: 'products', label: 'Products', icon: 'fas fa-cannabis' },
        { id: 'location', label: 'Visit Us', icon: 'fas fa-map-marker-alt' },
        { id: 'top', label: 'Top', icon: 'fas fa-arrow-up' },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300)

            const sections = ['home', 'products', 'about', 'location']
            const currentSection = sections.find((section) => {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    return rect.top <= 100 && rect.bottom >= 100
                }
                return false
            })

            if (currentSection) {
                setActiveSection(currentSection)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleQuickNavClick = (id: string) => {
        if (id === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div
            role="complementary"
            aria-label="Quick navigation shortcuts"
            aria-hidden={!isVisible}
            className={containerClasses}
        >
            <div className="flex flex-col space-y-2">
                <a
                    href="tel:+15736776418"
                    className="focus-enhanced auto-contrast flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-colors hover:bg-green-700"
                    aria-label="Call Route 66 Hemp"
                    tabIndex={focusableTabIndex}
                >
                    <i className="fas fa-phone" aria-hidden="true" />
                </a>

                {quickLinks.map((link) => {
                    const baseClasses = 'focus-enhanced flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-200'
                    const activeClasses = 'bg-blue-600 text-white scale-110'
                    const inactiveClasses = 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    const buttonClasses = baseClasses + ' ' + (activeSection === link.id ? activeClasses : inactiveClasses)

                    return (
                        <button
                            type="button"
                            key={link.id}
                            onClick={() => handleQuickNavClick(link.id)}
                            className={buttonClasses}
                            aria-label={'Go to ' + link.label}
                            title={link.label}
                            tabIndex={focusableTabIndex}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    handleQuickNavClick(link.id)
                                }
                            }}
                        >
                            <i className={link.icon + ' text-sm'} aria-hidden="true" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default QuickNavigation
