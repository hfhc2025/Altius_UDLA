// ────────────────────────────────────────────────────────────────
// src/app/api/kpis/cards-totales/route.ts
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  let client
  try {
    client = await pool.connect()

    const { rows } = await client.query(`
      SELECT
        SUM(total_registros) AS total_registros,
        SUM(citas)           AS citas,
        SUM(recorrido)       AS recorrido,
        SUM(usables)         AS usables,
        SUM(afluencias)      AS afluencias,
        SUM(matriculas)      AS matriculas
      FROM vw_kpi_tarjetas_totales;
    `)

    // Devuelve siempre un objeto (aunque venga null)
    return NextResponse.json(rows[0] ?? {})
  } catch (e) {
    console.error('[API ERROR /cards-totales]', e)
    return NextResponse.json(
      { error: 'Error leyendo tarjetas totales' },
      { status: 500 },
    )
  } finally {
    client?.release()
  }
}