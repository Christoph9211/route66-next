// components/AgeGate.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FocusTrap from 'focus-trap-react'
import Cookies from 'js-cookie'

type GateStep = 'age' | 'consent'

const AGE_COOKIE = 'route66_age_verified'
const CONSENT_COOKIE = 'cookieconsent_status'

function cookieOptions() {
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  return {
    expires: 180,
    sameSite: 'Lax' as const,
    secure: isSecure,
    path: '/',
    // Don't set httpOnly from client-side
  }
}

function AgeGate() {
  const [step, setStep] = useState<GateStep | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const primaryActionRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const evaluateState = useCallback(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    const hasAgeCookie = Cookies.get(AGE_COOKIE) === 'true'
    const consentStatus = Cookies.get(CONSENT_COOKIE)

    if (!hasAgeCookie) {
      setStep('age')
      setIsOpen(true)
      return
    }

    if (!consentStatus) {
      setStep('consent')
      setIsOpen(true)
      return
    }

    setIsOpen(false)
    setStep(null)
  }, [])

  useEffect(() => {
    // Delay evaluation slightly to ensure proper hydration
    const timer = setTimeout(() => {
      evaluateState()
    }, 10)
    
    return () => clearTimeout(timer)
  }, [evaluateState])

  // Listen for pageshow event to handle bfcache restoration
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // Re-evaluate state when page is shown from bfcache
      if (event.persisted) {
        evaluateState()
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [evaluateState])

  // Handle visibility change (for mobile browsers)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        evaluateState()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [evaluateState])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const siteContent = document.querySelector('[data-site-content]') as HTMLElement | null

    if (isOpen) {
      // Use data attributes instead of inline styles to avoid bfcache issues
      document.body.dataset.modalOpen = 'true'
      if (siteContent) {
        siteContent.setAttribute('inert', '')
        siteContent.setAttribute('aria-hidden', 'true')
      }
    } else {
      delete document.body.dataset.modalOpen
      if (siteContent) {
        siteContent.removeAttribute('inert')
        siteContent.removeAttribute('aria-hidden')
      }
    }

    return () => {
      delete document.body.dataset.modalOpen
      if (siteContent) {
        siteContent.removeAttribute('inert')
        siteContent.removeAttribute('aria-hidden')
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const timer = window.setTimeout(() => {
      primaryActionRef.current?.focus()
    }, 50)
    return () => window.clearTimeout(timer)
  }, [isOpen, step])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setStep(null)
  }, [])

  const dispatchAgeConfirmed = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const event = new CustomEvent('age:confirmed')
      window.dispatchEvent(event)
    } catch {
      // ignore event failures
    }
  }, [])

  const handleAgeConfirm = useCallback(() => {
    try {
      Cookies.set(AGE_COOKIE, 'true', cookieOptions())
      // Use sessionStorage as fallback (doesn't interfere with bfcache)
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('isAdult', 'true')
      }
    } catch {
      // ignore storage failures
    }

    dispatchAgeConfirmed()

    const consentStatus = Cookies.get(CONSENT_COOKIE)
    if (!consentStatus) {
      setStep('consent')
      setIsOpen(true)
    } else {
      closeModal()
    }
  }, [closeModal, dispatchAgeConfirmed])

  const dispatchConsentEvent = useCallback((status: 'accepted' | 'rejected') => {
    if (typeof window === 'undefined') return
    try {
      const event = new CustomEvent('consent:updated', { detail: status })
      window.dispatchEvent(event)
    } catch {
      // ignore event failures
    }
  }, [])

  const handleConsent = useCallback(
    (status: 'accepted' | 'rejected') => {
      Cookies.set(CONSENT_COOKIE, status, cookieOptions())

      try {
        // Use sessionStorage instead of localStorage for bfcache compatibility
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem('cookieConsent', status === 'accepted' ? 'accepted' : 'declined')
        }
      } catch {
        // ignore storage failures
      }

      dispatchConsentEvent(status)
      closeModal()
    },
    [closeModal, dispatchConsentEvent]
  )

  const focusTrapOptions = useMemo(
    () => ({
      escapeDeactivates: false,
      clickOutsideDeactivates: false,
      initialFocus: () => primaryActionRef.current ?? modalRef.current ?? undefined,
      // Allow focus trap to work with bfcache
      returnFocusOnDeactivate: false,
    }),
    []
  )

  if (!isOpen || !step) {
    return null
  }

  const titleId = step === 'age' ? 'route66-age-check-title' : 'route66-consent-title'
  const descriptionId =
    step === 'age' ? 'route66-age-check-description' : 'route66-consent-description'

  return (
    <FocusTrap focusTrapOptions={focusTrapOptions}>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4 py-8">
        <div className="absolute inset-0" aria-hidden="true" />
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="relative z-[10001] w-full max-w-lg rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white"
        >
          {step === 'age' ? (
            <>
              <h2 id={titleId} className="text-2xl font-semibold">
                Are you 21 or older?
              </h2>
              <p id={descriptionId} className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                You must confirm your age before browsing Route 66 Hemp.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  ref={primaryActionRef}
                  type="button"
                  onClick={handleAgeConfirm}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                >
                  I am 21+
                </button>
                <a
                  href="https://www.google.com"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-base font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900"
                >
                  No, take me back
                </a>
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                By confirming, you certify that you are of legal age in your jurisdiction.
              </p>
            </>
          ) : (
            <>
              <h2 id={titleId} className="text-2xl font-semibold">
                Manage Cookie Consent
              </h2>
              <p id={descriptionId} className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                We use analytics cookies to understand site performance. Choose whether to
                allow these cookies. Declining keeps essential cookies only.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  ref={primaryActionRef}
                  type="button"
                  onClick={() => handleConsent('accepted')}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                >
                  Accept all cookies
                </button>
                <button
                  type="button"
                  onClick={() => handleConsent('rejected')}
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-base font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900"
                >
                  Decline non-essential
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                You can update your preference later from your browser settings. Analytics
                tools stay disabled until you opt in.
              </p>
            </>
          )}
        </div>
      </div>
    </FocusTrap>
  )
}

export default AgeGate