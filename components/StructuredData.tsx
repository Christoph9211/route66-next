import {
    breadcrumbStructuredData,
    businessStructuredData,
    organizationStructuredData,
} from '@/data/structuredData'

// Structured Data Component for Local Business SEO

/**
 * StructuredData component for Local Business SEO.
 * Renders structured data for business information, breadcrumbs, and organization.
 * @returns {JSX.Element} The StructuredData component.
 */
function StructuredData() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(businessStructuredData),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbStructuredData),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationStructuredData),
                }}
            />
        </>
    )
}

export default StructuredData
