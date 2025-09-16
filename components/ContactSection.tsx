import LocalBusinessInfo from './LocalBusinessInfo'

export default function ContactSection() {
    return (
        <section id="contact" className="flex items-center justify-center bg-gray-50 py-16 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Have questions? We&apos;re here to help!</p>
                <div className="mt-12 flex justify-center">
                    <div className="w-full max-w-md">
                        <LocalBusinessInfo />
                    </div>
                </div>
            </div>
        </section>
    )
}        