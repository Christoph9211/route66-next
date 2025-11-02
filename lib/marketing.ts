export interface MarketingBlock {
    id: string
    eyebrow?: string
    title: string
    description: string
    cta?: {
        label: string
        href: string
    }
}

export const MARKETING_BLOCKS: MarketingBlock[] = [
    {
        id: 'loyalty',
        eyebrow: 'Loyalty Rewards',
        title: 'Join the Route 66 Loyalty Club',
        description:
            'Earn points with every purchase, unlock exclusive savings, and receive early access to our limited drops.',
        cta: {
            label: 'Sign up & save',
            href: '/loyalty',
        },
    },
    {
        id: 'store-pickup',
        eyebrow: 'In-Store Pickup',
        title: 'Reserve online, pick up in minutes',
        description:
            'Browse the menu, reserve your favorites, and swing by the shop when it suits your schedule—no waiting required.',
        cta: {
            label: 'View pickup details',
            href: '/pickup',
        },
    },
]
