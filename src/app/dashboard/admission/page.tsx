'use client'

import nextDynamic from 'next/dynamic'
import { useState } from 'react'

/* ───────────────────────── COMPONENTES ───────────────────────── */
import CountdownBanner   from '@/components/CountdownBanner'
import { Footer }        from '@/components/Footer'
import IndicadoresBanner from '@/components/IndicadoresBanner'
import KPICards2         from '@/components/KPICards2'
import { Sidebar }       from '@/components/Sidebar'
import TablaPorSemana    from '@/components/TablaPorSemana'

import { useTopCarreras }   from '@/hooks/useTopCarreras'
import { useTotalesFunnel } from '@/hooks/useTotalesFunnel'

/* ─── Dynamic imports (tipado actualizado) ──────────────────── */
const AnimatedFunnelDynamic = nextDynamic<{
  kpis: import('@/components/AnimatedFunnel').KPI
  tipoBase: 'Todas' | 'Lead' | 'Stock'
}>(() => import('@/components/AnimatedFunnel'), { ssr: false })

const CarrerasTopComboChart = nextDynamic<{
  data: any
  onFiltersChange: (filters: { sede?: string; periodo?: string }) => void
}>(() => import('@/components/CarrerasTopComboChart'), { ssr: false })

export const dynamic = 'force-dynamic'

type TabId =
  | 'admisiones'
  | 'ejecutivos'
  | 'diplomados'
  | 'difusion'
  | 'ejecutivos_difusion'

export default function Page() {
  /* Tabs y filtros */
  const [tab, setTab] = useState<TabId>('admisiones')
  const [sede, setSede] = useState<string | undefined>()
  const [periodo, setPeriodo] = useState<string | undefined>()

  /* Selector de tipo de base */
  const [tipoBase, setTipoBase] = useState<'Todas' | 'Lead' | 'Stock'>('Todas')

  /* Hooks con nuevo parámetro tipoBase (backend debe aceptar ?base=) */
  const {
    kpis,
    isLoading: loadFunnel,
    error: errFunnel
  } = useTotalesFunnel(tipoBase)

  const {
    carreras,
    isLoading: loadCarr,
    error: errCarr
  } = useTopCarreras({ limit: 6, sede, periodo })

  const handleFiltersChange = (filters: { sede?: string; periodo?: string }) => {
    setSede(filters.sede)
    setPeriodo(filters.periodo)
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100/50 to-white">
        {/* Fondos decorativos */}
        <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-blue-50/30 via-transparent to-slate-50/20" />
        <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-orange-50/20 via-transparent to-transparent" />
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={tab} onTabChange={(t: TabId) => setTab(t)} />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 lg:space-y-8 relative">
            {/* Banners superiores */}
            <div className="space-y-4">
              <IndicadoresBanner nombre="David" />
              <CountdownBanner />
            </div>

            {/* KPI cards */}
            <section className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50/90 to-white/90 border-b border-slate-200/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-sm" />
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Indicadores Clave de Rendimiento
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <KPICards2 />
              </div>
            </section>

            {/* Embudo + Carreras */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm" />
                <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Análisis de Conversión y Tendencias
                </h2>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* ──────────────── Embudo de Conversión ─────────────── */}
                <div className="bg-white/75 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50/90 to-white/90 border-b border-slate-200/60 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50/80 rounded-lg border border-orange-100/60 shadow-sm">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                          Embudo de Conversión
                        </h3>
                        <p className="text-sm text-slate-500">Flujo por etapas</p>
                      </div>
                    </div>

                    {/* Selector de tipo de base */}
                    <select
                      value={tipoBase}
                      onChange={(e) => setTipoBase(e.target.value as any)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs bg-white shadow-sm"
                    >
                      <option value="Todas">Todas</option>
                      <option value="Lead">Lead</option>
                      <option value="Stock">Stock</option>
                    </select>
                  </div>

                  <div className="p-6">
                    {errFunnel && (
                      <div className="bg-red-50/90 border border-red-200/60 rounded-lg p-4 mb-4 text-red-600 font-medium">
                        Error cargando el embudo
                      </div>
                    )}

                    {loadFunnel && !kpis && (
                      <div className="bg-blue-50/90 border border-blue-200/60 rounded-lg p-4 mb-4 text-blue-600 font-medium flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Cargando datos…
                      </div>
                    )}

                    {kpis && (
                      <AnimatedFunnelDynamic kpis={kpis} tipoBase={tipoBase} />
                    )}
                  </div>
                </div>

                {/* ──────────────── Top Carreras ─────────────── */}
                <div className="space-y-4">
                  {errCarr && (
                    <div className="bg-red-50/90 border border-red-200/60 rounded-lg p-4 text-red-600 font-medium">
                      Error cargando ranking de carreras
                    </div>
                  )}

                  {loadCarr && !carreras.length && (
                    <div className="bg-blue-50/90 border border-blue-200/60 rounded-lg p-4 text-blue-600 font-medium flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Cargando ranking de carreras…
                    </div>
                  )}

                  {carreras.length > 0 && (
                    <CarrerasTopComboChart
                      data={carreras}
                      onFiltersChange={handleFiltersChange}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Tabla por semana */}
            <section className="bg-white/75 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50/90 to-white/90 border-b border-slate-200/60 p-5 flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full shadow-sm" />
                <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Datos Detallados por Semana
                </h3>
              </div>
              <div className="p-6">
                <TablaPorSemana />
              </div>
            </section>
          </main>
        </div>

        <Footer />
      </div>
    </>
  )
}