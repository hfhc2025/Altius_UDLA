'use client';

import { useEffect, useState, useMemo } from 'react';

import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

interface EjecutivoKPI {
  semana: number;
  tipo_base: string;
  agente: string;
  total_base: number;
  citas: number;
  recorrido: number;
  usables: number;
  afluencias: number;
  matriculas: number;
  pct_recorrido: number | null;
  pct_usables: number | null;
  pct_afluencia: number | null;
  pct_matricula: number | null;
}

export default function PageEjecutivos() {
  const [data, setData] = useState<EjecutivoKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSemana, setSelectedSemana] = useState<string>('');
  const [selectedTipoBase, setSelectedTipoBase] = useState<string>('');
  const [sortField, setSortField] = useState<keyof EjecutivoKPI | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetch('/api/kpis/por-ejecutivo')
      .then((res) => res.json())
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, []);

  const { semanas, tiposBase, filteredData } = useMemo(() => {
    if (!Array.isArray(data)) return { semanas: [], tiposBase: [], filteredData: [] };

    const semanasUnicas = [...new Set(data.map(d => d.semana))].sort((a, b) => a - b);
    const tiposBaseUnicos = [...new Set(data.map(d => d.tipo_base))].sort();

    let filtered = data;

    if (selectedSemana) {
      filtered = filtered.filter(d => d.semana.toString() === selectedSemana);
    }
    if (selectedTipoBase) {
      filtered = filtered.filter(d => d.tipo_base === selectedTipoBase);
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    return { semanas: semanasUnicas, tiposBase: tiposBaseUnicos, filteredData: filtered };
  }, [data, selectedSemana, selectedTipoBase, sortField, sortDirection]);

  const handleSort = (field: keyof EjecutivoKPI) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100/50 to-white">
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-blue-50/30 via-transparent to-slate-50/20" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-orange-50/20 via-transparent to-transparent" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab="ejecutivos_difusion" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
          <h2 className="text-xl font-bold text-slate-700">Detalle por Ejecutivo</h2>

          {loading && <p className="text-slate-500">Cargando datos…</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {!loading && !error && (
            <div className="space-y-4">
              {/* Filtros */}
              <div className="flex flex-wrap gap-4 p-4 bg-white/70 backdrop-blur rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Semana</label>
                  <select
                    value={selectedSemana}
                    onChange={(e) => setSelectedSemana(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-blue-500"
                  >
                    <option value="">Todas las semanas</option>
                    {semanas.map((s) => (
                      <option key={s} value={s.toString()}>Semana {s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Tipo de Base</label>
                  <select
                    value={selectedTipoBase}
                    onChange={(e) => setSelectedTipoBase(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-blue-500"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposBase.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <span className="text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                    {filteredData.length} registro{filteredData.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Tabla */}
              <div className="overflow-auto rounded-xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Agente</th>
                      <th className="px-3 py-2 text-right">Total</th>
                      <th className="px-3 py-2 text-right">Citas</th>
                      <th className="px-3 py-2 text-right">Recorrido</th>
                      <th className="px-3 py-2 text-right">Usables</th>
                      <th className="px-3 py-2 text-right">Afluencias</th>
                      <th className="px-3 py-2 text-right">Matrículas</th>
                      <th className="px-3 py-2 text-right">% Recorrido</th>
                      <th className="px-3 py-2 text-right">% Usables</th>
                      <th className="px-3 py-2 text-right">% Afluencia</th>
                      <th className="px-3 py-2 text-right">% Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-3 py-8 text-center text-slate-500">
                          No hay registros que coincidan con los filtros seleccionados
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, i) => (
                        <tr key={`${row.semana}-${row.agente}-${i}`} className="even:bg-white odd:bg-slate-50/50">
                          <td className="px-3 py-2">{row.agente}</td>
                          <td className="px-3 py-2 text-right">{row.total_base}</td>
                          <td className="px-3 py-2 text-right">{row.citas}</td>
                          <td className="px-3 py-2 text-right">{row.recorrido}</td>
                          <td className="px-3 py-2 text-right">{row.usables}</td>
                          <td className="px-3 py-2 text-right">{row.afluencias}</td>
                          <td className="px-3 py-2 text-right">{row.matriculas}</td>
                          <td className="px-3 py-2 text-right">{Number(row.pct_recorrido ?? 0).toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right">{Number(row.pct_usables ?? 0).toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right">{Number(row.pct_afluencia ?? 0).toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right">{Number(row.pct_matricula ?? 0).toFixed(1)}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}