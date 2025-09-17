import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ANALYTICS_SCRIPT_SOURCES = [
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://analytics.google.com',
  'https://va.vercel-scripts.com',
  'https://vitals.vercel-insights.com',
]

function generateNonce() {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  let string = ''
  array.forEach((value) => {
    string += String.fromCharCode(value)
  })

  return btoa(string)
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce()

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' ${ANALYTICS_SCRIPT_SOURCES.join(' ')}`,
    `connect-src 'self' ${ANALYTICS_SCRIPT_SOURCES.join(' ')}`,
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-csp-nonce', nonce)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: '/:path*',
}
