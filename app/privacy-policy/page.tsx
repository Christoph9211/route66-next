import type { Metadata } from 'next'
// import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Privacy Policy - Route 66 Hemp',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="policy-content mx-auto max-w-4xl p-4">
        <h1 className="mb-4 text-3xl font-bold">
          Route 66 Hemp Privacy Policy
        </h1>
        <p className="mb-4">
          This Privacy Policy describes how Route 66 Hemp (&quot;we&quot;, &quot;us&quot;) collects and uses
          information when you use our website or services.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">Information We Collect</h2>
        <p className="mb-4">
          We may collect personal identifiers such as your name, contact information, device
          identifiers, and information about your purchases or interactions with our site.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">How We Use Information</h2>
        <p className="mb-4">
          We use your information to provide and improve our products and services, communicate with you,
          and comply with legal obligations. We may also use cookies and similar technologies to analyze
          site traffic and trends.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">Sharing Information</h2>
        <p className="mb-4">
          We may share your information with service providers who assist us in operating our business, or
          as required by law. We do not sell your personal information.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">Governing Law; Dispute Resolution</h2>
        <p className="mb-4">
          This Policy is governed by Missouri law. ANY DISPUTE SHALL BE RESOLVED BY CONFIDENTIAL ARBITRATION
          IN PULASKI COUNTY, MISSOURI, ON AN INDIVIDUAL BASIS.
        </p>
        <p className="mt-8">
          For questions about this policy, email us at{' '}
          <a href="mailto:route66hemp@gmail.com">
            route66hemp@gmail.com
          </a>
          .
        </p>
      </main>
    </>
  )
}
