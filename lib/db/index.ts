import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL
  ? (() => {
      const url = new URL(process.env.DATABASE_URL)
      if (url.searchParams.get('sslmode') === 'require' || url.searchParams.get('sslmode') === 'prefer' || url.searchParams.get('sslmode') === 'verify-ca') {
        url.searchParams.set('sslmode', 'verify-full')
      }
      return url.toString()
    })()
  : undefined

export const pool = new Pool({ connectionString: databaseUrl })
export const db = drizzle(pool, { schema })
