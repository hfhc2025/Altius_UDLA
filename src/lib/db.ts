import { Pool, QueryResultRow } from 'pg'

export const pool = new Pool({
  connectionString: process.env.NEON_URL,
  ssl: { rejectUnauthorized: false },
})

export async function getClient() {
  return pool.connect()
}

// ✅ Query tipada sin any
export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[] // usamos unknown, no any
): Promise<Array<T>> {
  const result = await pool.query<T>(sql, params)
  return result.rows
}