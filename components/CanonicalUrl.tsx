'use client'

import { usePathname } from 'next/navigation'

export default function CanonicalUrl() {
    const pathname = usePathname()
    const canonicalUrl = `https://route66hemp.com${pathname}`
    return <link rel="canonical" href={canonicalUrl} />
}
