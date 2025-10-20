import Image from 'next/image'

import ScrollLink from './ScrollLink'

export default function AboutSection() {
    return (
        <section
            id="about"
            role="region"
            aria-labelledby="about-heading"
            tabIndex={-1}
            data-section-nav
            className="bg-white py-16 dark:bg-gray-900 focus:outline-none"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
                    <div>
                        <h2 id="about-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
                            About Route 66 Hemp
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Located in the heart of St Robert, Missouri, Route 66 Hemp has been serving the Pulaski County community with premium hemp products since 2025.
                        </p>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            We&apos;re committed to providing high-quality, lab-tested hemp products that meet the highest standards of purity and potency.
                        </p>
                        <div className="mt-8">
                            <ScrollLink targetId="location" className="inline-flex items-center rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 focus-enhanced">
                                <i className="fas fa-map-marker-alt mr-2" /> Visit Our Store
                            </ScrollLink>
                        </div>
                    </div>
                    <div className="mt-8 space-y-6 lg:mt-0">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-green-100 shadow-xl shadow-green-900/10 dark:border-green-800/60 dark:shadow-green-900/40">
                            <Image
                                src="/assets/images/route-66-hemp-storefront-st-robert-1280w.webp"
                                alt="Route 66 Hemp storefront on Route 66 in St. Robert, Missouri"
                                fill
                                sizes="(min-width: 1024px) 36rem, (min-width: 640px) 28rem, 100vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-green-50 p-6 shadow-sm dark:bg-green-900 dark:shadow-none">
                                <div className="flex items-center">
                                    <i className="fas fa-certificate text-2xl text-green-600" />
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Lab Tested</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">All products verified</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-green-50 p-6 shadow-sm dark:bg-green-900 dark:shadow-none">
                                <div className="flex items-center">
                                    <i className="fas fa-users text-2xl text-green-600" />
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Local Experts</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Knowledgeable staff</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}