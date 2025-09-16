'use client';
// Location-specific content component for local SEO

/**
 * LocationContent is a component that displays location-specific content
 * for local SEO. It renders information about the city, state, county,
 * region, nearby areas, and landmarks.
 *
 * @returns {JSX.Element} The JSX element representing the LocationContent
 * component.
 */
function LocationContent() {
    const locationData = {
        city: 'St Robert',
        state: 'Missouri',
        county: 'Pulaski County',
        region: 'Central Missouri',
        nearbyAreas: [
            'Fort Leonard Wood',
            'Waynesville',
            'Rolla',
            'Lebanon',
            'Crocker',
        ],
        landmarks: [
            'Fort Leonard Wood Military Base',
            'Route 66 State Park',
            'Gasconade River',
            'Mark Twain National Forest',
        ],
    }

    return (
        <section id="location" className="bg-gray-50 py-12 dark:bg-gray-900">
            <div className="wrapper">
                <div className="mb-10 lg:text-center">
                    <h2 className="dark:text-secondary text-base font-semibold uppercase tracking-wide text-green-300">
                        Serving {locationData?.city || 'our area'} & Surrounding
                        Areas
                    </h2>
                    <p className="fluid-heading mt-2 font-extrabold leading-tight tracking-tight dark:text-white">
                        Your Local Hemp Store in{' '}
                        {locationData?.region || 'your region'}
                    </p>
                    <p className="fluid-body mt-4 max-w-2xl text-gray-700 lg:mx-auto dark:text-gray-200">
                        Proudly serving the {locationData?.city || 'community'},{' '}
                        {locationData?.state || 'state'} community with premium
                        hemp products since 2025.
                    </p>
                </div>

                <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h3 className="mb-4 font-semibold fluid-subheading dark:text-white">
                            <i
                                className="fas fa-map-marked-alt mr-2 text-green-600"
                                aria-hidden="true"
                            />
                            Areas We Serve
                        </h3>
                        <p className="fluid-body mb-4 text-gray-700 dark:text-gray-200">
                            Located conveniently on State Highway Z in{' '}
                            {locationData?.city || 'your city'}, we serve
                            customers throughout{' '}
                            {locationData?.county || 'your county'} and the
                            greater {locationData?.region || 'your region'}{' '}
                            area.
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {locationData?.nearbyAreas?.map((area) => (
                                <div
                                    key={area}
                                    className="flex items-center text-sm text-gray-600 dark:text-gray-200"
                                >
                                    <i
                                        className="fas fa-check-circle mr-2 text-xs text-green-600"
                                        aria-hidden="true"
                                    />
                                    {area}
                                </div>
                            )) || (
                                <p className="text-gray-700 dark:text-white">
                                    No nearby areas available.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h3 className="mb-4 font-semibold fluid-subheading dark:text-white">
                            <i
                                className="fas fa-landmark mr-2 text-green-600"
                                aria-hidden="true"
                            />
                            Near Local Landmarks
                        </h3>
                        <p className="fluid-body mb-4 text-gray-700 dark:text-gray-200">
                            Find us easily near these well-known{' '}
                            {locationData?.city || 'city'} and{' '}
                            {locationData?.region || 'region'} landmarks:
                        </p>
                        <div className="space-y-2">
                            {locationData?.landmarks?.map((landmark) => (
                                <div
                                    key={landmark}
                                    className="flex items-center text-sm text-gray-600 dark:text-gray-200"
                                >
                                    <i
                                        className="fas fa-map-pin mr-2 text-xs text-green-600"
                                        aria-hidden="true"
                                    />
                                    {landmark}
                                </div>
                            )) || (
                                <p className="text-gray-700 dark:text-white">
                                    No landmarks available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                    <h3 className="mb-6 text-center font-semibold fluid-heading dark:text-white">
                        Why Choose Route 66 Hemp in{' '}
                        {locationData?.city || 'our city'}?
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                                <i
                                    className="fas fa-users text-2xl text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <h4 className="mb-2 text-lg font-semibold dark:text-white">
                                Local Expertise
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                As a locally-owned business in{' '}
                                {locationData?.city || 'our city'}, we
                                understand our community&apos;s needs and
                                preferences.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                                <i
                                    className="fas fa-shipping-fast text-2xl text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <h4 className="mb-2 text-lg font-semibold dark:text-white">
                                Convenient Location
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                Easy access from Fort Leonard Wood, Waynesville,
                                and throughout{' '}
                                {locationData?.county || 'our county'}.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                                <i
                                    className="fas fa-handshake text-2xl text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <h4 className="mb-2 text-lg font-semibold dark:text-white">
                                Community Focused
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                Committed to supporting the{' '}
                                {locationData?.city || 'our city'} community
                                with quality products and service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LocationContent
