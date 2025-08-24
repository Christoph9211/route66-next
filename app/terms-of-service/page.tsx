import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Terms of Service - Route 66 Hemp',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-RGSJT8T1EF" />
      <Script id="gtag-init">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-RGSJT8T1EF');
      `}</Script>
      <main className="mx-auto max-w-4xl p-4">
        <h1 className="auto-contrast mb-4 text-3xl font-bold">
          Route 66 Hemp Terms of Service
        </h1>
        <p className="mb-4">
          PLEASE READ THESE TERMS OF SERVICE (&quot;TERMS&quot;, &quot;AGREEMENT&quot;)
          CAREFULLY. BY ACCESSING OR USING OUR WEBSITE, YOU AGREE TO BE
          BOUND BY THESE TERMS.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">Privacy</h2>
        <p className="mb-4">
          Our{' '}
          <a href="/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </a>{' '}
          describes how we collect, use, and share your information. By
          using this site, you consent to our Privacy Policy.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">Restrictions</h2>
        <p className="mb-4">
          The information on this site is for your personal,
          non-commercial use. You may not reproduce, distribute, or
          otherwise exploit any content without our written permission.
          You agree not to use any automated means to access the site or
          interfere with its operation.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">Eligibility</h2>
        <p className="mb-4">
          This site is intended only for users who are twenty-one (21)
          years of age or older. By using the site, you represent that you
          meet this requirement.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">
          Disclaimer of Warranty
        </h2>
        <p className="mb-4">
          THIS SITE AND ALL INFORMATION PROVIDED IS OFFERED &quot;AS IS&quot;
          WITHOUT WARRANTY OF ANY KIND. ROUTE 66 HEMP DISCLAIMS ALL
          WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND
          FITNESS FOR A PARTICULAR PURPOSE.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">
          Limitation of Liability
        </h2>
        <p className="mb-4">
          TO THE EXTENT PERMITTED BY LAW, ROUTE 66 HEMP SHALL NOT BE
          LIABLE FOR ANY DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF
          THIS SITE.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify and hold Route 66 Hemp harmless from any
          claims arising out of your use of the site or violation of these
          Terms.
        </p>
        <h2 className="mb-2 mt-6 text-2xl font-semibold">
          Governing Law; Dispute Resolution
        </h2>
        <p className="mb-4">
          These Terms are governed by the laws of the State of Missouri.
          ANY DISPUTE SHALL BE RESOLVED BY CONFIDENTIAL ARBITRATION IN
          PULASKI COUNTY, MISSOURI, ON AN INDIVIDUAL BASIS.
        </p>
        <p className="mt-8">
          If you have questions about these Terms, please contact us at{' '}
          <a
            href="mailto:route66hemp@gmail.com"
            className="text-blue-600 underline dark:text-blue-400"
          >
            route66hemp@gmail.com
          </a>
          .
        </p>
      </main>
    </>
  )
}
