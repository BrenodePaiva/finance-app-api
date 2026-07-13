import 'dotenv/config.js'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'
import { PrismaClient } from '../src/generated/prisma/client.ts'

const adapter = new PrismaPostgresAdapter({
    connectionString: process.env.DATABASE_URL
})

export const prisma = new PrismaClient({ adapter })
