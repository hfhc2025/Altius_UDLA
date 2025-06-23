import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(`
      WITH datos AS (
        SELECT
          tipo_base,
          SUM(base_total)::bigint AS total_base,
          SUM(recorrido)::bigint AS recorrido,
          SUM(contactados)::bigint AS contactados,
          SUM(citas)::bigint AS citas,
          SUM(afluencias)::bigint AS afluencias,
          SUM(matriculas)::bigint AS matriculas
        FROM udla_gestion.vw_admision_funnel_por_base
        WHERE tipo_base IN ('Lead', 'Stock')
        GROUP BY tipo_base
      )
      SELECT * FROM datos
      UNION ALL
      SELECT
        'Total' AS tipo_base,
        SUM(total_base),
        SUM(recorrido),
        SUM(contactados),
        SUM(citas),
        SUM(afluencias),
        SUM(matriculas)
      FROM datos;
    `)

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[API /kpis/funnel]', err)
    return NextResponse.json(
      { error: 'Error leyendo datos del funnel' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}