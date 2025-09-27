/**
 * analytics-consent.js
 * Couples age verification & consent cookies with Google Consent Mode v2.
 * Exposes:
 *  - window.confirmAge21()
 *  - window.tryInitAnalytics()
 */

(function () {
  const GA_ID = 'G-RGSJT8T1EF'
  const AGE_COOKIE = 'route66_age_verified'
  const CONSENT_COOKIE = 'cookieconsent_status'
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

  // Ensure dataLayer and Consent Mode defaults exist ASAP
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments)
    }
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })

  function readCookie(name) {
    if (typeof document === 'undefined') return undefined
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  function writeCookie(name, value) {
    if (typeof document === 'undefined') return
    let cookie = name + '=' + encodeURIComponent(value) + '; Path=/; SameSite=Lax'
    cookie += '; Max-Age=' + COOKIE_MAX_AGE
    try {
      if (window.location.protocol === 'https:') {
        cookie += '; Secure'
      }
    } catch {
      // ignore situations where window.location is unavailable
    }
    document.cookie = cookie
  }

  function setSessionItem(key, value) {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value)
      }
    } catch {
      // ignore storage failures
    }
  }

  function hasConfirmedAge() {
    return readCookie(AGE_COOKIE) === 'true'
  }

  function hasConsent() {
    return readCookie(CONSENT_COOKIE) === 'accepted'
  }

  function ensureDataLayer() {
    window.dataLayer = window.dataLayer || []
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments)
      }
    }
  }

  function updateConsentMode(status) {
    if (typeof window.gtag !== 'function') return
    const mode = status === 'accepted' ? 'granted' : 'denied'
    window.gtag('consent', 'update', {
      ad_storage: mode,
      analytics_storage: mode,
      ad_user_data: mode,
      ad_personalization: mode,
    })
  }

  function loadAnalytics() {
    if (window.__analyticsLoaded) return
    window.__analyticsLoaded = true

    ensureDataLayer()

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID)
    const nonce = typeof window !== 'undefined' ? window.__next_script_nonce__ : undefined
    if (nonce) {
      script.setAttribute('nonce', String(nonce))
    }
    document.head.appendChild(script)

    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { anonymize_ip: true, cookie_domain: 'none' })
  }

  function tryInitAnalytics() {
    if (!hasConfirmedAge() || !hasConsent()) return
    loadAnalytics()
    updateConsentMode('accepted')
  }

  function storeConsent(status) {
    writeCookie(CONSENT_COOKIE, status)
    setSessionItem('cookieConsent', status === 'accepted' ? 'accepted' : 'declined')
    if (status === 'accepted') {
      tryInitAnalytics()
    } else {
      updateConsentMode('rejected')
    }
  }

  function confirmAge21() {
    writeCookie(AGE_COOKIE, 'true')
    setSessionItem('isAdult', 'true')
    try {
      const evt = new CustomEvent('age:confirmed')
      window.dispatchEvent(evt)
    } catch {
      // ignore event errors
    }
    tryInitAnalytics()
  }

  window.tryInitAnalytics = tryInitAnalytics
  window.confirmAge21 = confirmAge21

  window.addEventListener('consent:updated', function (event) {
    const detail = event && event.detail
    if (detail === 'accepted' || detail === 'rejected') {
      storeConsent(detail)
    }
  })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInitAnalytics)
  } else {
    tryInitAnalytics()
  }
})()

