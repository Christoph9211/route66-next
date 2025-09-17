import React from 'react'

/**
 * SkipLinks component provides keyboard navigation shortcuts for screen readers
 * and keyboard-only users to quickly jump to main content areas.
 */
export default function SkipLinks() {
    const skipLinks = [
        { href: '#main-content', label: 'Skip to main content' },
        { href: '#navigation', label: 'Skip to navigation' },
        { href: '#products', label: 'Skip to products' },
        { href: '#contact', label: 'Skip to contact information' },
    ]

    return (
        <div className="skip-links">
            {skipLinks.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    tabIndex={0}
                >
                    {link.label}
                </a>
            ))}
        </div>
    )
}