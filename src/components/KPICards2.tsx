// src/components/KPICards2.tsx
'use client';

import { useMemo } from 'react';
import useSWR from 'swr';

/* ---------- Tipos ---------- */
interface RowKPI {
  total_registros: number | string;
  citas: number | string;
  recorrido: number | string;
  contactados: number | string;
  afluencias: number | string;
  matriculas: number | string;
}

interface KPICardData {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  isPercentage: boolean;
  color: string;
}

/* ---------- Utils ---------- */
const fetcher = (url: string) => fetch(url).then(r => r.json());
const n = (v: string | number | null | undefined): number => {
  const num = Number(v);
  return isNaN(num) ? 0 : num;
};
const fmtN = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `${(v / 1_000).toFixed(1)}K`
  : v.toLocaleString();
const fmtP = (v: number) => `${v.toFixed(2)}%`;
const udla = 'bg-gradient-to-br from-orange-600 to-amber-500';

/* -------------------------------------------------------------------------------- */
export default function KPICards2() {
  const { data, error, isLoading } = useSWR<RowKPI>(
    '/api/kpis/totales',
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false }
  );

  const cards = useMemo<KPICardData[]>(() => {
    if (!data) return [];

    const registros     = n(data.total_registros);
    const citas         = n(data.citas);
    const recorrido     = n(data.recorrido);
    const contactados   = n(data.contactados);
    const afluencias    = n(data.afluencias);
    const matriculas    = n(data.matriculas);

    return [
      { id:'reg',  title:'Registros cargados', value: fmtN(registros),  subtitle:'Total base', isPercentage: false, color:udla },
      { id:'cit',  title:'Citas generadas',    value: fmtN(citas),      subtitle:'Total citas', isPercentage: false, color:udla },
      { id:'rec',  title:'Recorrido',          value: fmtN(recorrido),  subtitle:'Conecta + No conecta', isPercentage: false, color:udla },
      { id:'val',  title:'Registros usables',  value: fmtN(contactados),subtitle:'Teléfonos válidos', isPercentage: false, color:udla },
      { id:'afl',  title:'Afluencias',         value: fmtN(afluencias), subtitle:'Estados válidos UDLA', isPercentage: false, color:udla },
      { id:'mat',  title:'Matrículas',         value: fmtN(matriculas), subtitle:'Final del embudo', isPercentage: false, color:udla },
    ];
  }, [data]);

  if (error) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-6 animate-pulse min-h-[120px]"
            />
          ))
        : cards.map(c => (
            <div
              key={c.id}
              className={`${c.color} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col h-full min-h-[120px]">
                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">{c.value}</h3>
                  <div className="w-8 h-1 bg-white/30 rounded-full mb-3" />
                  <p className="text-sm md:text-base font-semibold opacity-95">{c.title}</p>
                </div>
                {c.subtitle && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <p className="text-xs opacity-80">{c.subtitle}</p>
                  </div>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <div className={`w-2 h-2 rounded-full ${c.isPercentage ? 'bg-white/40' : 'bg-white/60'}`} />
              </div>
            </div>
          ))}
    </div>
  );
}