import { NextRequest, NextResponse } from 'next/server'


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
 * The nonce is generated randomly and is used to allow structured data scripts to execute
 * The allowed sources for scripts are first-party and Vercel analytics resources
 * The allowed sources for connecting are limited to first-party and Vercel analytics endpoints
 * The allowed sources for images are self and data: and blob:
 * The allowed sources for styles are self and 'unsafe-inline'
 * The allowed sources for fonts are self and data:
 * Object-src is set to none to prevent malicious objects from being executed
 * Base-uri is set to self to prevent malicious base URLs from being used
 * Frame-ancestors is set to none to prevent malicious frames from being executed
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export function proxy(request: NextRequest): NextResponse {
  const nonceString = generateNonceString()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-csp-nonce', nonceString)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const analyticsHosts = [
    'https://vitals.vercel-analytics.com',
    'https://vitals.vercel-insights.com',
  ]

  const cspDirectives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonceString}'`,
      'https://vitals.vercel-analytics.com',
      'https://vitals.vercel-insights.com',
    ],
    "connect-src": ["'self'", ...analyticsHosts],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", 'data:', 'blob:'],
    "font-src": ["'self'", 'data:'],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "frame-ancestors": ["'none'"],
  }

  const csp = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: '/:path*',
}

