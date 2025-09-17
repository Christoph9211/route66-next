import type { NextConfig } from 'next'

// The Content-Security-Policy is issued dynamically with a per-request nonce in middleware.ts.
const securityHeaders = [
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
