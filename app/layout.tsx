import './globals.css'
import { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import CanonicalUrl from '@/components/CanonicalUrl'
import AgeGate from '@/components/AgeGate'
import AnalyticsConsentGate from '@/components/AnalyticsConsentGate'
import SkipLinks from '@/components/SkipLinks'
import './styles/fa/fontawesome.min.css'
import './styles/fa/brands.min.css'
import './styles/fa/regular.min.css'
import './styles/fa/solid.min.css'
import './styles/fa/icons.min.css'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Route 66 Hemp - Premium Hemp Products | St Robert, MO',
    description: 'Premium hemp products in St Robert, Missouri. Quality THCA flower, Concentrates, and Edibles. Serving Pulaski County and Fort Leonard Wood area.',
    keywords: [
        'CBD', 'THCA', 'Cannabis', 'Hemp', 'Route 66 Hemp', 'St Robert MO', 'Pulaski County',
        'Fort Leonard Wood', 'Dispensary', 'Cannabis Accessories'
    ],
    metadataBase: new URL('https://www.route66hemp.com'),
    openGraph: {
        type: 'website',
        url: 'https://www.route66hemp.com',
        title: 'Route 66 Hemp - Premium Hemp Products | St Robert, MO',
        description: 'Premium hemp products in St Robert, Missouri. Quality THCA flower, Concentrates, and Edibles. Serving Pulaski County and Fort Leonard Wood area.',
        siteName: 'Route 66 Hemp',
        locale: 'en_US',
    },
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16' },
            { url: '/favicon-32x32.png', sizes: '32x32' }
        ],
        apple: '/apple-touch-icon.png',
    },
    authors: [{ name: 'Christopher Gibbons', url: 'mailto:route66hemp@gmail.com' }],
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: 'black',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <head>
                {/* Self-hosted Font Awesome for better performance */}
                <link rel="preload" as="font" href="/webfonts/fa-solid-900.woff2" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" as="font" href="/webfonts/fa-regular-400.woff2" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" as="font" href="/webfonts/fa-brands-400.woff2" type="font/woff2" crossOrigin="anonymous" />
                <CanonicalUrl />
            </head>
            <body className="bg-gray-50 font-sans antialiased dark:bg-gray-900 transition-colors duration-300">
                <SkipLinks />
                <AgeGate />
                <div data-site-content>
                    {children}
                    <AnalyticsConsentGate />
                </div>
            </body>
        </html>
    )
}
