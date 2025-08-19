import { Suspense } from 'react'
import StructuredData from '@/components/StructuredData'
import { CartProvider } from '@/hooks/useCart'
import ClientHomePage from '@/components/ClientHomePage'


export default function HomePage() {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <StructuredData />
                <Suspense fallback={
                    <div className="flex min-h-screen items-center justify-center">
                        <div className="leaf-loader animate-spin"></div>
                        <span className="ml-3 text-lg">Loading...</span>
                    </div>
                }>
                    <ClientHomePage />
                </Suspense>
            </div>
        </CartProvider>
    )
}