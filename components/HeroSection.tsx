// components/HeroSection.tsx
/**
 * Hero section with a modern gradient background and soft foreground
 * elements. Uses a subtle blurred blob to create depth and updated
 * call to action styles for a more contemporary feel.
 */
import Image from 'next/image'

import ScrollLink from './ScrollLink'

export default function HeroSection() {
    return (
        <section
            id="home"
            role="region"
            aria-labelledby="home-heading"
            tabIndex={-1}
            data-section-nav
            className="relative isolate overflow-hidden py-24 text-center text-white sm:py-32"
        >
            <div className="absolute inset-0 -z-30">
                <Image
                    src="/assets/images/route-66-hemp-storefront-st-robert-1920w.avif"
                    alt="Route 66 Hemp storefront in St Robert, Missouri"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            </div>
            {/* Background gradient */}
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-green-700/80" />
            {/* Blurred accent blob */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/60 blur-3xl" />
            <div className="relative mx-auto max-w-2xl px-6">
                <h1
                    id="home-heading"
                    className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl"
                >
                    Route 66 Hemp
                </h1>
                <p className="mx-auto mb-10 max-w-xl text-lg leading-8 text-green-100">
                    Premium hemp products for your wellness journey.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <ScrollLink
                        targetId="products"
                        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-green-800 shadow-lg transition-colors hover:bg-green-50 focus-enhanced"
                    >
                        <i className="fas fa-cannabis mr-2" /> Shop Products
                    </ScrollLink>
                    <a
                        href="tel:+15736776418"
                        className="rounded-full border border-white/80 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 focus-enhanced"
                    >
                        <i className="fas fa-phone mr-2" /> Call (573) 677-6418
                    </a>
                </div>
            </div>
        </section>
    )
}

