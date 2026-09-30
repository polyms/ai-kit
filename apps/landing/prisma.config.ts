import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Migrate needs a direct (non-pooled) connection; fall back to the pooled URL.
    // Plain process.env so `prisma generate` still works without a database (CI/build).
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})
