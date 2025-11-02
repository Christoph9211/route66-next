import type { MarketingBlock } from '@/lib/marketing'

interface MarketingHighlightsProps {
    blocks: MarketingBlock[]
}

export default function MarketingHighlights({ blocks }: MarketingHighlightsProps) {
    if (!blocks || blocks.length === 0) {
        return null
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="grid gap-6 md:grid-cols-2">
                    {blocks.map((block) => (
                        <article
                            key={block.id}
                            className="focus-enhanced group flex h-full flex-col justify-between rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-green-900/40 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
                        >
                            <div className="space-y-3">
                                {block.eyebrow ? (
                                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
                                        {block.eyebrow}
                                    </p>
                                ) : null}
                                <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white">
                                    {block.title}
                                </h3>
                                <p className="text-base text-gray-600 dark:text-gray-300">{block.description}</p>
                            </div>
                            {block.cta ? (
                                <a
                                    href={block.cta.href}
                                    className="mt-6 inline-flex items-center text-sm font-semibold text-green-700 transition hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:text-green-300 dark:hover:text-green-200 dark:focus:ring-offset-gray-900"
                                >
                                    {block.cta.label}
                                    <span aria-hidden="true" className="ml-2">→</span>
                                </a>
                            ) : null}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
