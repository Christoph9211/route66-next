import type { NextConfig } from 'next'

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    // CSP directives are concatenated into one string
    value: [
      "default-src 'self'",
      // Allow only our own scripts and specific analytics providers; keep 'unsafe-inline' until nonces/hashes can be added
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      // Allow connections to GA, GTM and Vercel for analytics and vitals
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      // Permit images from the same origin, data URIs and blobs (Next/Image uses blobs)
      "img-src 'self' data: blob:",
      // Permit inline styles (Tailwind injects them) but nothing external; if you add external stylesheets, list their domains here
      "style-src 'self' 'unsafe-inline'",
      // Allow local fonts and data URIs
      "font-src 'self' data:",
      // Disallow all plugin content
      "object-src 'none'",
      // Disallow the use of <base> tags from setting an unexpected base URL
      "base-uri 'self'",
      // Prevent the site from being embedded in frames or iframes
      "frame-ancestors 'none'",
      // Uncomment to automatically upgrade all HTTP requests to HTTPS
      // "upgrade-insecure-requests",
    ].join('; '),
  },
  // Click‑jacking protection: frame‑ancestors is sufficient; X‑Frame‑Options is redundant
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Enforce cross‑origin isolation to protect against XS‑leaks and unauthorized resource loading
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  // Define what browser features third parties can use; expand as needed
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
