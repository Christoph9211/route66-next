import LocalBusinessInfo from './LocalBusinessInfo'

export default function ContactSection() {
    return (
        <section id="contact" className="bg-gray-50 py-16 dark:bg-gray-800">
            <div className="wrapper text-center">
                <h2 className="fluid-heading font-bold text-gray-900 dark:text-white">Contact Us</h2>
                <p className="fluid-body mt-4 text-gray-600 dark:text-gray-300">Have questions? We&apos;re here to help!</p>
                <div className="mt-12 flex justify-center">
                    <div className="w-full max-w-md">
                        <LocalBusinessInfo />
                    </div>
                </div>
            </div>
        </section>
    )
}        
