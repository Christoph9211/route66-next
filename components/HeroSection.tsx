// components/HeroSection.tsx
export default function HeroSection() {
    return (
        <section
            id="home"
            className="relative overflow-hidden py-24 text-center text-white"
        >
            <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600"></div>
            <div className="absolute inset-0 -z-10 bg-grid opacity-20"></div>
            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
                    Route 66 Hemp
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-xl text-green-100">
                    Premium hemp products for your wellness journey.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                        href="#products"
                        className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-medium text-green-700 shadow hover:bg-green-50"
                    >
                        <i className="fas fa-cannabis mr-2" /> Shop Products
                    </a>
                    <a
                        href="tel:+15736776418"
                        className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3 font-medium text-white backdrop-blur-sm hover:bg-white/10"
                    >
                        <i className="fas fa-phone mr-2" /> Call (573) 677-6418
                    </a>
                </div>
            </div>
        </section>
    )
}