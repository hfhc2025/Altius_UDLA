// src/app/api/kpis/por-semana/route.ts
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  let client
  try {
    client = await pool.connect()

    /* ← incluimos el schema para que Postgres encuentre la vista */
    const { rows } = await client.query(`
      SELECT *
      FROM   udla_gestion.vw_kpi_horizontal_por_semana
      ORDER  BY semana, tipo_base;
    `)

    return NextResponse.json(rows)
  } catch (e) {
    console.error('[API ERROR /kpis/por-semana]', e)
    return NextResponse.json(
      { error: 'Error leyendo KPIs por semana' },
      { status: 500 }
    )
  } finally {
    client?.release()
  }
}