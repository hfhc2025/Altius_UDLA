'use client'

import useSWR from 'swr'
import type { KPI } from '@/components/AnimatedFunneldiplomado'

export function useTotalesFunnelsD(tipoBase: 'Todas' | 'Lead' | 'Stock') {
  const url = `/api/kpis/funnel-diplomado?tipoBase=${tipoBase}`

  const { data, error, isLoading } = useSWR(url, async (u) => {
    const res = await fetch(u)
    if (!res.ok) throw new Error(`API ${u} → ${res.status}`)
    const rows: KPI[] = await res.json()

    // Sumar manualmente
    const totalRow: KPI = {
      tipo_base: 'Total',
      base_total: 0,
      recorrido: 0,
      contactados: 0,
      citas: 0,
      afluencias: 0,
      matriculas: 0
    }

    for (const r of rows) {
      totalRow.base_total  += r.base_total
      totalRow.recorrido   += r.recorrido
      totalRow.contactados += r.contactados
      totalRow.citas       += r.citas
      totalRow.afluencias  += r.afluencias
      totalRow.matriculas  += r.matriculas
    }

    return [...rows, totalRow]
  })

  return { kpis: data, error, isLoading }
}