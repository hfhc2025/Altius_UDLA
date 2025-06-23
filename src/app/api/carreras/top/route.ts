// src/app/api/carreras/top/route.ts
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const limit = parseInt(searchParams.get('limit') ?? '6', 10)
  const sede  = searchParams.get('sede')?.toLowerCase() || null   // “todas” = null

  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `
      SELECT career, sede, periodo, interesados
      FROM   udla_gestion.mv_carreras_interes
      WHERE  ($1::text IS NULL OR LOWER(sede) = $1)
      ORDER  BY interesados DESC
      LIMIT  $2
      `,
      [sede === 'todas' ? null : sede, limit]
    )

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[API ERROR /carreras/top]', err)
    return NextResponse.json(
      { error: 'Error obteniendo top carreras' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}