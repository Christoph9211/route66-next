// components/HeroSection.tsx
export default function HeroSection() {
    return (
        <section id="home" className="relative bg-gradient-to-br from-green-800 to-green-900 py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    Route 66 Hemp
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-xl text-green-100">
                    Premium hemp products for your wellness journey.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a href="#products" className="inline-flex items-center rounded-lg bg-white px-8 py-3 font-medium text-green-800 hover:bg-green-50">
                        <i className="fas fa-cannabis mr-2" /> Shop Products
                    </a>
                    <a href="tel:+15736776418" className="inline-flex items-center rounded-lg border-2 border-white px-8 py-3 font-medium text-white hover:bg-white hover:text-green-800">
                        <i className="fas fa-phone mr-2" /> Call (573) 677-6418
                    </a>
                </div>
            </div>
        </section>
    )
}