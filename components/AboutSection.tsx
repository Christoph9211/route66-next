export default function AboutSection() {
    return (
        <section id="about" className="bg-white py-16 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">About Route 66 Hemp</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Located in the heart of St Robert, Missouri, Route 66 Hemp has been serving the Pulaski County community with premium hemp products since 2025.
                        </p>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            We&apos;re committed to providing high-quality, lab-tested hemp products that meet the highest standards of purity and potency.
                        </p>
                        <div className="mt-8">
                            <a href="#location" className="inline-flex items-center rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800">
                                <i className="fas fa-map-marker-alt mr-2" /> Visit Our Store
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 lg:mt-0">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900">
                                <div className="flex items-center">
                                    <i className="fas fa-certificate text-2xl text-green-600" />
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Lab Tested</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">All products verified</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900">
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