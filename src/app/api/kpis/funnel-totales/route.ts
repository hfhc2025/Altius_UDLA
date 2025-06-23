// src/app/api/kpis/funnel-totales/route.ts
import { NextResponse } from 'next/server';

import { pool } from '@/lib/db';            // usa el pool singleton

export const runtime = 'nodejs';

/**
 * GET /api/kpis/funnel-totales
 * Devuelve las etapas del funnel sólo para la semana más reciente
 */
export async function GET() {
  let client;

  try {
    client = await pool.connect();          // ← abre conexión del pool

    const { rows } = await client.query(`
      SELECT *
      FROM vw_kpi_funnel_etapas
      WHERE semana = (SELECT MAX(semana) FROM vw_kpi_funnel_etapas)
    `);

    return NextResponse.json(rows[0] ?? {});  // siempre un solo registro
  } catch (e) {
    console.error('[API ERROR /funnel-totales]', e);
    return NextResponse.json(
      { error: 'Error KPIs funnel' },
      { status: 500 },
    );
  } finally {
    client?.release();                      // ← devuelve la conexión al pool
  }
}