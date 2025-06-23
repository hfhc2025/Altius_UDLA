import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(`
      SELECT 
        'Semana ' || (FLOOR(("Fecha Gestion"::date - '2025-05-01'::date) / 7) + 1)::text AS semana,
        COALESCE("Tipo Base", 'Stock') AS tipo_base,
        COUNT(*) AS total_base,
        COUNT(CASE 
            WHEN "Conecta" IS NOT NULL 
              OR "No Conecta" IS NOT NULL 
              OR "Comunica Con" IS NOT NULL 
            THEN 1 
        END) AS recorrido,
        COUNT(CASE 
            WHEN "Conecta" = 'Conecta' 
              OR "No Conecta" = 'User busy' 
            THEN 1 
        END) AS contactados,
        COUNT(CASE 
            WHEN "Interesa" ILIKE 'Viene' 
            THEN 1 
        END) AS citas,
        COUNT(CASE 
            WHEN "Conecta" ILIKE '%Validado%' 
              OR "No Conecta" IN ('Normal call clearing', 'User busy', 'No user responding', 'No answer from user (user alerted)', 'Call rejected', 'Normal, unspecified')
            THEN 1 
        END) AS usables,
        COUNT(CASE 
            WHEN "MC" ILIKE '%MC%' 
              OR "MC" ILIKE '%A%' 
            THEN 1 
        END) AS afluencias,
        COUNT(CASE 
            WHEN "Fecha MC" ILIKE '%2025%' 
            THEN 1 
        END) AS matriculas
      FROM udla_gestion.diplomado_gestion
      WHERE "Fecha Gestion"::date >= '2025-05-01'
      GROUP BY FLOOR(("Fecha Gestion"::date - '2025-05-01'::date) / 7), COALESCE("Tipo Base", 'Stock')
      ORDER BY FLOOR(("Fecha Gestion"::date - '2025-05-01'::date) / 7) + 1 DESC, tipo_base;
    `)

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[API /kpis/por-semana-diplomado]', err)
    return NextResponse.json(
      { error: 'Error leyendo datos diplomado por semana' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}