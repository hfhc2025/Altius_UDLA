import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tipoBase = searchParams.get('tipoBase')

  const client = await pool.connect()
  try {
    const { rows } = await client.query(`
      WITH datos AS (
        SELECT
          tipo_base,
          base_total,
          recorrido,
          contactados,
          citas,
          afluencias,
          matriculas
        FROM udla_gestion.vw_funnel_diplomado_totales
        WHERE tipo_base IN ('Lead', 'Stock')
      )
      SELECT * FROM datos
      ${tipoBase === 'Todas' ? '' : `WHERE tipo_base = '${tipoBase}'`}
      UNION ALL
      SELECT
        'Total' AS tipo_base,
        SUM(base_total),
        SUM(recorrido),
        SUM(contactados),
        SUM(citas),
        SUM(afluencias),
        SUM(matriculas)
      FROM datos
      ${tipoBase === 'Todas' ? '' : `WHERE tipo_base = '${tipoBase}'`};
    `)

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[API /kpis/funnel-diplomado]', err)
    return NextResponse.json(
      { error: 'Error leyendo datos del funnel de diplomado' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}