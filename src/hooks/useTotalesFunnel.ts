import useSWR from 'swr'
import type { KPI } from '@/components/AnimatedFunnel'

export function useTotalesFunnel(tipoBase: 'Todas' | 'Lead' | 'Stock') {
  const url = `/api/kpis/funnel?tipoBase=${tipoBase}`

  const { data, error, isLoading } = useSWR(url, async (u) => {
    const res = await fetch(u)
    if (!res.ok) throw new Error(`API ${u} → ${res.status}`)
    const rows: KPI[] = await res.json()
    return rows
  })

  return { kpis: data ?? [], error, isLoading }
}