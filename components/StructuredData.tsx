import { headers } from 'next/headers'

type HeaderList = Awaited<ReturnType<typeof headers>>

function extractCspNonce(headerList: HeaderList): string | undefined {
    const directNonce = headerList.get('x-csp-nonce')
    if (directNonce) {
        return directNonce
    }

    const cspHeader =
        headerList.get('content-security-policy') ??
        headerList.get('content-security-policy-report-only')
    if (!cspHeader) {
        return undefined
    }

    const directive = cspHeader
        .split(';')
        .map((entry) => entry.trim())
        .find((entry) => entry.startsWith('script-src') || entry.startsWith('default-src'))

    if (!directive) {
        return undefined
    }

    const source = directive
        .split(/\s+/)
        .slice(1)
        .find((value) => value.startsWith("'nonce-") && value.endsWith("'"))

    return source ? source.slice(7, -1) : undefined
}

// Structured Data Component for Local Business SEO

/**
 * StructuredData component for Local Business SEO.
 * Renders structured data for business information, breadcrumbs, and organization.
 * @returns {Promise<JSX.Element>} The StructuredData component.
 */
async function StructuredData() {
    const headerList = await headers()
    const nonce = extractCspNonce(headerList)

    const businessData = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Route 66 Hemp',
        description:
            'Premium hemp products for your wellness journey. Quality you can trust.',
        url: 'https://www.route66hemp.com',
        telephone: '+1-573-677-6418',
        email: 'route66hemp@gmail.com',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '14076 State Hwy Z',
            addressLocality: 'St Robert',
            addressRegion: 'MO',
            postalCode: '65584',
            addressCountry: 'US',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '37.83490',
            longitude: '-92.09725',
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                opens: '11:00',
                closes: '21:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Friday', 'Saturday'],
                opens: '11:00',
                closes: '22:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '11:00',
                closes: '19:00',
            },
        ],
        priceRange: '$',
        currenciesAccepted: 'USD',
        paymentAccepted: 'Cash',
        image: 'https://www.route66hemp.com/og-image.jpg',
        logo: 'https://www.route66hemp.com/favicon-32x32.png',
        sameAs: [
            'https://www.facebook.com/route66hemp',
            'https://www.instagram.com/route66hemp',
            'https://www.twitter.com/route66hemp',
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.4',
            reviewCount: '8',
        },
        review: [
            {
                '@type': 'Review',
                author: {
                    '@type': 'Person',
                    name: 'Sarah Johnson',
                },
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                },
                reviewBody:
                    'Excellent quality hemp products and knowledgeable staff. Great selection and fair prices.',
            },
        ],
    }

    const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.route66hemp.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: 'https://www.route66hemp.com',
            },
        ],
    }

    const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Route 66 Hemp',
        url: 'https://www.route66hemp.com',
        logo: 'https://www.route66hemp.com/favicon-32x32.png',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-573-677-6418',
            contactType: 'customer service',
            availableLanguage: 'English',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: '14076 State Hwy Z',
            addressLocality: 'St Robert',
            addressRegion: 'MO',
            postalCode: '65584',
            addressCountry: 'US',
        },
    }

    return (
        <>
            <script
                nonce={nonce}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(businessData),
                }}
            />
            <script
                nonce={nonce}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbData),
                }}
            />
            <script
                nonce={nonce}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationData),
                }}
            />
        </>
    )
}

export default StructuredData
