import StructuredData from '@/components/StructuredData'
import ClientHomePage from '@/components/ClientHomePage'
import path from 'path'
import { promises as fs } from 'fs'

async function getProducts() {
    const filePath = path.join(process.cwd(), 'public', 'products', 'products.json')
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
}

export default async function HomePage() {
    const products = await getProducts()
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StructuredData />
            <ClientHomePage products={products} />
        </div>
    )
}

