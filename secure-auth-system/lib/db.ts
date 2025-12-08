import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

// 1. Create a connection pool using the standard Node-Postgres driver
const pool = new Pool({ connectionString })

// 2. Pass the pool to the Prisma Adapter
const adapter = new PrismaPg(pool)

// 3. Instantiate PrismaClient with the adapter
// This effectively handles the "runtime" connection logic
export const prisma = new PrismaClient({ adapter })