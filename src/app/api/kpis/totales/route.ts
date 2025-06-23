/**
 * src/app/api/kpis/totales/route.ts
 *
 * Devuelve los totales globales (Lead + Stock) que el front
 * muestra en las tarjetas KPI.  NO usa ya la vista obsoleta
 * “vw_kpi_contactados_totales”.
 */
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET () {
  const client = await pool.connect()
  try {
    /* -----------------------------------------------------------
       La vista udla_gestion.vw_admision_funnel_por_base ya trae:
         · base_total      · recorrido
         · contactados     · citas   (RUT único)
         · afluencias      · matriculas
       Sólo necesitamos sumar Lead + Stock.
    ----------------------------------------------------------- */
    const { rows } = await client.query(`
      SELECT
        'Total'::text                    AS tipo_base,
        SUM(base_total)::bigint          AS base_total,
        SUM(recorrido)::bigint           AS recorrido,
        SUM(contactados)::bigint         AS contactados,
        SUM(citas)::bigint               AS citas,
        SUM(afluencias)::bigint          AS afluencias,
        SUM(matriculas)::bigint          AS matriculas
      FROM   udla_gestion.vw_admision_funnel_por_base
      WHERE  tipo_base IN ('Lead','Stock');
    `)

    /* Siempre habrá 1 fila; devolvemos directamente el objeto */
    return NextResponse.json(rows[0] ?? {})
  } catch (err) {
    console.error('[API /kpis/totales]', err)
    return NextResponse.json(
      { error: 'Error leyendo KPIs totales' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}