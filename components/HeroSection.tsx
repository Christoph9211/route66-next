// components/HeroSection.tsx
/**
 * Hero section with a modern gradient background and soft foreground
 * elements. Uses a subtle blurred blob to create depth and updated
 * call to action styles for a more contemporary feel.
 */
export default function HeroSection() {
    return (
        <section
            id="home"
            className="relative isolate overflow-hidden py-24 text-center text-white sm:py-32"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-900 via-emerald-800 to-green-700" />
            {/* Blurred accent blob */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400 opacity-30 blur-3xl" />
            <div className="wrapper max-w-2xl">
                <h1 className="fluid-title mb-6 font-extrabold tracking-tight">
                    Route 66 Hemp
                </h1>
                <p className="fluid-body mx-auto mb-10 max-w-xl text-green-100">
                    Premium hemp products for your wellness journey.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <a
                        href="#products"
                        className="min-h-[44px] min-w-[44px] rounded-full bg-white px-8 py-3 text-sm font-semibold text-green-800 shadow-lg transition-colors hover:bg-green-50"
                    >
                        <i className="fas fa-cannabis mr-2" /> Shop Products
                    </a>
                    <a
                        href="tel:+15736776418"
                        className="min-h-[44px] min-w-[44px] rounded-full border border-white/80 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                    >
                        <i className="fas fa-phone mr-2" /> Call (573) 677-6418
                    </a>
                </div>
            </div>
        </section>
    )
}

