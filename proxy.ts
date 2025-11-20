import { NextResponse } from 'next/server'

/**
 * Sets a Content Security Policy header to prevent malicious scripts from being executed
 * Inline scripts are explicitly allowed so structured data scripts can execute without a nonce
 * The allowed sources for scripts are first-party and Vercel analytics resources
 * The allowed sources for connecting are limited to first-party and Vercel analytics endpoints
 * The allowed sources for images are self and data: and blob:
 * The allowed sources for styles are self and 'unsafe-inline'
 * The allowed sources for fonts are self and data:
 * Object-src is set to none to prevent malicious objects from being executed
 * Base-uri is set to self to prevent malicious base URLs from being used
 * Frame-ancestors is set to none to prevent malicious frames from being executed
 * @returns {NextResponse}
 */
export function proxy(): NextResponse {
  const response = NextResponse.next()

  const analyticsHosts = [
    'https://vitals.vercel-analytics.com',
    'https://vitals.vercel-insights.com',
  ]

  const cspDirectives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
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

  response.headers.set('Content-Security-Policy', Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; '))

  return response
}

