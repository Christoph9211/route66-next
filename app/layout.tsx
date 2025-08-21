import './globals.css'
import { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Viewport } from 'next'

export const metadata: Metadata = {
    title: 'Route 66 Hemp - Premium Hemp Products | St Robert, MO',
    description: 'Premium hemp products in St Robert, Missouri. Quality CBD flower, concentrates, and vapes. Serving Pulaski County and Fort Leonard Wood area.',
    keywords: [
        'CBD', 'THCA', 'Cannabis', 'Hemp', 'Route 66 Hemp', 'St Robert MO', 'Pulaski County',
        'Fort Leonard Wood', 'Dispensary', 'Cannabis Accessories'
    ],
    metadataBase: new URL('https://route66hemp.com'),
    openGraph: {
        type: 'website',
        url: 'https://route66hemp.com',
        title: 'Route 66 Hemp - Premium Hemp Products | St Robert, MO',
        description: 'Premium hemp products in St Robert, Missouri. Quality CBD flower, concentrates, and vapes. Serving Pulaski County and Fort Leonard Wood area.',
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
  themeColor: 'black', // optional
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </head>
            <body className="bg-gray-50 font-sans antialiased dark:bg-gray-900 transition-colors duration-300">
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
