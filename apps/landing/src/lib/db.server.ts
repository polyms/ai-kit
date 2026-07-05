import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../../prisma/schema/client.ts'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pgPool?: Pool
}

function getOrCreatePool(): Pool {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: process.env.VERCEL ? 1 : 10,
    })
  }
  return globalForPrisma.pgPool
}

function createPrismaClient() {
  const pool = getOrCreatePool()

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

export function getPgPool(): Pool {
  return getOrCreatePool()
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
