import fs from 'node:fs/promises'
import path from 'node:path'

interface TransactionRecord {
    orderId: string
    paymentId?: string
    status: string
    cartHash: string
    amount: number
    createdAt: string
    updatedAt?: string
}

const storePath = path.join(process.cwd(), 'data', 'transactions.json')

async function readTransactions(): Promise<TransactionRecord[]> {
    try {
        const raw = await fs.readFile(storePath, 'utf8')
        return JSON.parse(raw) as TransactionRecord[]
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []
        }
        console.error('Failed to read transactions', error)
        return []
    }
}

async function writeTransactions(records: TransactionRecord[]) {
    await fs.mkdir(path.dirname(storePath), { recursive: true })
    await fs.writeFile(storePath, JSON.stringify(records, null, 2), 'utf8')
}

export async function findTransactionByHash(
    cartHash: string
): Promise<TransactionRecord | undefined> {
    const records = await readTransactions()
    return records.find((record) => record.cartHash === cartHash)
}

export async function recordTransaction(
    record: TransactionRecord
): Promise<TransactionRecord> {
    const records = await readTransactions()
    records.push(record)
    await writeTransactions(records)
    return record
}

export async function updateTransactionStatus(
    paymentId: string,
    status: string
): Promise<void> {
    const records = await readTransactions()
    const record = records.find((entry) => entry.paymentId === paymentId)
    if (!record) return

    record.status = status
    record.updatedAt = new Date().toISOString()
    await writeTransactions(records)
}
