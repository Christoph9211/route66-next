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
        headers: [
          ...securityHeaders.filter(h => h.key !== 'Cache-Control'),
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }, // Allows bfcache
        ],
      },
    ]
  },
  
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  
  // Generate static pages where possible
  generateBuildId: async () => {
    // Use a consistent build ID for better caching
    return process.env.BUILD_ID || 'default-build-id'
  },
}

export default nextConfig