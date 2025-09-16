'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'

const CONSENT_COOKIE = 'cookieconsent_status'

const Analytics = dynamic(async () => {
  const mod = await import('@vercel/analytics/react')
  return mod.Analytics
}, { ssr: false })

const SpeedInsights = dynamic(async () => {
  const mod = await import('@vercel/speed-insights/react')
  return mod.SpeedInsights
}, { ssr: false })

function AnalyticsConsentGate() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const evaluate = () => {
      setEnabled(Cookies.get(CONSENT_COOKIE) === 'accepted')
    }

    const handleConsentUpdated = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      if (detail === 'accepted' || detail === 'rejected') {
        evaluate()
      }
    }

    evaluate()
    window.addEventListener('consent:updated', handleConsentUpdated)
    return () => window.removeEventListener('consent:updated', handleConsentUpdated)
  }, [])

  if (!enabled) {
    return null
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default AnalyticsConsentGate

