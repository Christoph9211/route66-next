import { NextRequest, NextResponse } from 'next/server'

const ANALYTICS_SCRIPT_SOURCES = [
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://analytics.google.com',
  'https://va.vercel-scripts.com',
  'https://vitals.vercel-insights.com',
]

/**
 * Generates a random nonce string for use in a Content Security Policy header.
 *
 * @returns {string} The generated nonce string.
 */
function generateNonceString(): string {
  const randomNumberArray = new Uint8Array(16)
  crypto.getRandomValues(randomNumberArray)
  const nonceString = Array.from(randomNumberArray)
    .map((value) => String.fromCharCode(value))
    .join('')
  return btoa(nonceString)
}

/**
 * Sets a Content Security Policy header to prevent malicious scripts from being executed
 * The nonce is generated randomly and is used to allow the analytics script to be executed
 * The allowed sources for scripts are the analytics script, the vitals script and the vercel scripts
 * The allowed sources for connecting are the analytics script and the vitals script
 * The allowed sources for images are self and data: and blob:
 * The allowed sources for styles are self and 'unsafe-inline'
 * The allowed sources for fonts are self and data:
 * Object-src is set to none to prevent malicious objects from being executed
 * Base-uri is set to self to prevent malicious base URLs from being used
 * Frame-ancestors is set to none to prevent malicious frames from being executed
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export function middleware(request: NextRequest): NextResponse {
  const nonceString = generateNonceString()

  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonceString}' ${ANALYTICS_SCRIPT_SOURCES.join(' ')}`,
    `connect-src 'self' 'unsafe-eval' ${ANALYTICS_SCRIPT_SOURCES.join(' ')}`,
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-csp-nonce', nonceString)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('Content-Security-Policy', contentSecurityPolicy)

  return response
}

export const config = {
  matcher: '/:path*',
}

