// next.config.ts
import type { NextConfig } from 'next'

// Security headers that are bfcache-compatible
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Modified COOP header for better bfcache compatibility
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' }, // Changed from 'same-origin'
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
  // Add explicit cache control for static assets
  { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
]

const nextConfig: NextConfig = {
  async headers() {
    try {
      return [
        // Different caching strategies for different resource types
        {
          source: '/fonts/(.*)',
          headers: [
            ...securityHeaders,
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          source: '/images/(.*)',
          headers: [
            ...securityHeaders,
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            ...securityHeaders,
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        // HTML pages should have shorter cache times and no 'no-store'
        {
          source: '/(.*)',
          headers: securityHeaders
            .filter(h => h.key !== 'Cache-Control')
            .concat([
              { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }, // Allows bfcache
            ]),
        },
      ]
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error generating headers:', error.message)
        console.error('Error generating headers stack:', error.stack)
      } else {
        console.error('Error generating headers:', error)
      }
      return []
    }
  },
  
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  
  // Generate static pages where possible
  generateBuildId: async () => {
    // Use a consistent build ID for better caching
    const buildId = process.env.BUILD_ID || 'default-build-id'
    if (typeof buildId !== 'string') {
      console.error('BUILD_ID must be a string')
      return 'default-build-id'
    }
    return buildId
  },

  publicRuntimeConfig: {
    clover: {
      merchantId: process.env.CLOVER_MERCHANT_ID,
    },
  },
  serverRuntimeConfig: {
    clover: {
      merchantId: process.env.CLOVER_MERCHANT_ID,
      apiKey: process.env.CLOVER_API_KEY,
      baseUrl: process.env.CLOVER_BASE_URL,
      webhookSecret: process.env.CLOVER_WEBHOOK_SECRET,
      allowedOrigins: process.env.CLOVER_ALLOWED_ORIGINS,
    },
  },
}

export default nextConfig
