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
            className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden py-24 text-center text-white sm:py-32"
        >
            <div className="absolute inset-0 -z-20">
                <Image
                    src="/assets/images/route-66-hemp-storefront-st-robert-1920w.avif"
                    alt="Route 66 Hemp storefront"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    className="object-cover object-center scale-105 animate-pulse-soft"
                />
            </div>

            {/* Modern Gradient Overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-emerald-950/60 to-gray-900/90" />

            {/* Animated Background Elements */}
            <div className="absolute left-1/4 top-1/4 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[100px] animate-float" />
            <div className="absolute right-1/4 bottom-1/4 -z-10 h-[25rem] w-[25rem] translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/20 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 mx-auto max-w-4xl px-6">
                <div className="animate-float" style={{ animationDuration: '8s' }}>
                    <span className="inline-block rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-bold text-emerald-200 backdrop-blur-sm border border-emerald-500/30 mb-6 shadow-theme-glow">
                        ✨ Premium Quality Hemp Products
                    </span>
                </div>

                <h1
                    id="home-heading"
                    className="mb-8 text-6xl font-extrabold tracking-tight sm:text-7xl drop-shadow-lg"
                >
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-200">
                        Route 66 Hemp
                    </span>
                </h1>

                <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-gray-100 drop-shadow-md">
                    Experience the finest selection of THCa flower, concentrates, and edibles in St. Robert.
                    Your wellness journey starts here.
                </p>

                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <ScrollLink
                        targetId="products"
                        className="group relative overflow-hidden rounded-full bg-emerald-600 px-10 py-4 text-base font-bold text-white shadow-theme-lg transition-all hover:bg-emerald-500 hover:scale-105 hover:shadow-theme-glow focus-enhanced"
                    >
                        <span className="relative z-10 flex items-center">
                            <i className="fas fa-cannabis mr-2 text-lg group-hover:rotate-12 transition-transform" />
                            Shop Now
                        </span>
                    </ScrollLink>

                    <a
                        href="tel:+15736776418"
                        className="group rounded-full glass px-10 py-4 text-base font-bold text-white transition-all hover:bg-white/20 hover:scale-105 focus-enhanced"
                    >
                        <span className="flex items-center">
                            <i className="fas fa-phone mr-2 group-hover:animate-pulse" />
                            (573) 677-6418
                        </span>
                    </a>
                </div>
            </div>
        </section>
    )
}

