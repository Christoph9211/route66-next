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
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-csp-nonce', nonceString)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set(
    'Content-Security-Policy',
    Object.entries({
      "default-src": ["'none'"],
      "script-src": ["'self'"],
      "connect-src": ["'self'"],
      "img-src": ["'self'"], 
      "style-src": ["'self'"],
      "form-action": ["'self'"],
      "font-src": ["'self'"],
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
      "frame-ancestors": ["'none'"],
    })
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ')
  )

  return response
}

export const config = {
  matcher: '/:path*',
}

