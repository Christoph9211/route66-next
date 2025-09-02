'use client'

import { useEffect, useRef } from 'react'

export default function CookieBanner() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const showIfNeeded = () => {
      try {
        const isAdult = typeof window !== 'undefined' && localStorage.getItem('isAdult') === 'true'
        const hasChoice = typeof window !== 'undefined' && !!localStorage.getItem('cookieConsent')
        if (isAdult && !hasChoice) {
          el.style.display = 'flex'
        }
      } catch {
        // ignore
      }
    }

    // Show on mount if already of age and no consent yet
    showIfNeeded()

    // Also react to custom event from analytics-consent.js after age confirmation
    const onAgeConfirmed = () => showIfNeeded()
    window.addEventListener('age:confirmed', onAgeConfirmed)
    return () => window.removeEventListener('age:confirmed', onAgeConfirmed)
  }, [])

  const accept = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted')
      if (ref.current) ref.current.style.display = 'none'
      if (typeof window !== 'undefined' && window.tryInitAnalytics) window.tryInitAnalytics()
    } catch {
      // ignore
    }
  }

  const decline = () => {
    try {
      localStorage.setItem('cookieConsent', 'declined')
      if (ref.current) ref.current.style.display = 'none'
    } catch {
      // ignore
    }
  }

  return (
    <div
      id="cookie-banner"
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-[9999] hidden items-start justify-between gap-4 bg-gray-900/95 p-4 text-white backdrop-blur md:flex"
      style={{ display: 'none' }}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="max-w-3xl text-sm leading-6">
        We use cookies and similar technologies to improve your experience, analyze traffic, and for marketing.
        See our <a className="underline" href="/cookie-policy">Cookie Policy</a> for details.
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={decline}
          className="rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
