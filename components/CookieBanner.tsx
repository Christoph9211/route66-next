'use client'

import { useEffect, useRef } from 'react'
import Cookies from 'js-cookie'

const AGE_COOKIE = 'route66_age_verified'
const CONSENT_COOKIE = 'cookieconsent_status'

function cookieOptions() {
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  return {
    expires: 180,
    sameSite: 'Lax' as const,
    secure: isSecure,
    path: '/',
  }
}

function dispatchConsentEvent(status: 'accepted' | 'rejected') {
  if (typeof window === 'undefined') return
  try {
    const event = new CustomEvent('consent:updated', { detail: status })
    window.dispatchEvent(event)
  } catch {
    // ignore event failures
  }
}

export default function CookieBanner() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const showIfNeeded = () => {
      const element = ref.current
      if (!element) return

      try {
        const hasAgeCookie = Cookies.get(AGE_COOKIE) === 'true'
        const isAdultFromStorage =
          typeof window !== 'undefined' && localStorage.getItem('isAdult') === 'true'
        const isAdult = hasAgeCookie || isAdultFromStorage

        const consentCookie = Cookies.get(CONSENT_COOKIE)
        const hasLocalChoice =
          typeof window !== 'undefined' && !!localStorage.getItem('cookieConsent')
        const hasChoice = Boolean(consentCookie) || hasLocalChoice

        element.style.display = isAdult && !hasChoice ? 'flex' : 'none'
      } catch {
        // On storage access failures, default to hiding the banner to avoid repeated prompts
        ref.current?.style.setProperty('display', 'none')
      }
    }

    // Show on mount if already of age and no consent yet
    showIfNeeded()

    // React to custom events fired from the consent flow
    const onAgeConfirmed: EventListener = () => showIfNeeded()
    const onConsentUpdated: EventListener = () => showIfNeeded()

    window.addEventListener('age:confirmed', onAgeConfirmed)
    window.addEventListener('consent:updated', onConsentUpdated)

    return () => {
      window.removeEventListener('age:confirmed', onAgeConfirmed)
      window.removeEventListener('consent:updated', onConsentUpdated)
    }
  }, [])

  const accept = () => {
    try {
      Cookies.set(CONSENT_COOKIE, 'accepted', cookieOptions())
      localStorage.setItem('cookieConsent', 'accepted')
    } catch {
      // ignore storage failures
    }

    if (ref.current) ref.current.style.display = 'none'

    dispatchConsentEvent('accepted')
  }

  const decline = () => {
    try {
      Cookies.set(CONSENT_COOKIE, 'rejected', cookieOptions())
      localStorage.setItem('cookieConsent', 'declined')
    } catch {
      // ignore storage failures
    }

    if (ref.current) ref.current.style.display = 'none'

    dispatchConsentEvent('rejected')
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
          type="button"
          onClick={decline}
          className="rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={accept}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
