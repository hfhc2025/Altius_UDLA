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
  pct_recorrido: number;
  pct_usables: number;
  pct_afluencia: number;
  pct_matricula: number;
}

export default function PageEjecutivos() {
  const [data, setData] = useState<EjecutivoKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para los filtros
  const [selectedSemana, setSelectedSemana] = useState<string>('');
  const [selectedTipoBase, setSelectedTipoBase] = useState<string>('');
  
  // Estados para el ordenamiento
  const [sortField, setSortField] = useState<keyof EjecutivoKPI | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetch('/api/kpis/por-agente')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, []);

  // Función para manejar el ordenamiento
  const handleSort = (field: keyof EjecutivoKPI) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Obtener valores únicos para los filtros y datos filtrados
  const { semanas, tiposBase, filteredData } = useMemo(() => {
    if (!data) return { semanas: [], tiposBase: [], filteredData: [] };

    const semanasUnicas = [...new Set(data.map(item => item.semana))].sort((a, b) => a - b);
    const tiposBaseUnicos = [...new Set(data.map(item => item.tipo_base))].sort();

    let filtered = data;

    if (selectedSemana) {
      filtered = filtered.filter(item => item.semana.toString() === selectedSemana);
    }

    if (selectedTipoBase) {
      filtered = filtered.filter(item => item.tipo_base === selectedTipoBase);
    }

    // Aplicar ordenamiento
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
    }

    return {
      semanas: semanasUnicas,
      tiposBase: tiposBaseUnicos,
      filteredData: filtered
    };
  }, [data, selectedSemana, selectedTipoBase, sortField, sortDirection]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100/50 to-white">
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-blue-50/30 via-transparent to-slate-50/20" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-orange-50/20 via-transparent to-transparent" />

      <div className="flex flex-1 overflow-hidden">
        {/* ← Sidebar resaltando "Ejecutivos" */}
        <Sidebar activeTab="ejecutivos" />

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
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Todas las semanas</option>
                    {semanas.map(semana => (
                      <option key={semana} value={semana.toString()}>
                        Semana {semana}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Tipo de Base</label>
                  <select
                    value={selectedTipoBase}
                    onChange={(e) => setSelectedTipoBase(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposBase.map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contador de resultados */}
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
                      <th 
                        className="px-3 py-2 text-left cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('agente')}
                      >
                        <div className="flex items-center gap-1">
                          Agente
                          <span className="text-slate-400">
                            {sortField === 'agente' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('total_base')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Total
                          <span className="text-slate-400">
                            {sortField === 'total_base' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('citas')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Citas
                          <span className="text-slate-400">
                            {sortField === 'citas' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('recorrido')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Recorrido
                          <span className="text-slate-400">
                            {sortField === 'recorrido' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('usables')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Usables
                          <span className="text-slate-400">
                            {sortField === 'usables' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('afluencias')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Afluencias
                          <span className="text-slate-400">
                            {sortField === 'afluencias' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('matriculas')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Matrículas
                          <span className="text-slate-400">
                            {sortField === 'matriculas' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('pct_recorrido')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          % Recorrido
                          <span className="text-slate-400">
                            {sortField === 'pct_recorrido' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('pct_usables')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          % Usables
                          <span className="text-slate-400">
                            {sortField === 'pct_usables' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('pct_afluencia')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          % Afluencia
                          <span className="text-slate-400">
                            {sortField === 'pct_afluencia' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 select-none transition-colors"
                        onClick={() => handleSort('pct_matricula')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          % Matrícula
                          <span className="text-slate-400">
                            {sortField === 'pct_matricula' ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </div>
                      </th>
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
                          <td className="px-3 py-2 text-right">{row.total_base.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">{row.citas}</td>
                          <td className="px-3 py-2 text-right">{row.recorrido}</td>
                          <td className="px-3 py-2 text-right">{row.usables}</td>
                          <td className="px-3 py-2 text-right">{row.afluencias}</td>
                          <td className="px-3 py-2 text-right">{row.matriculas}</td>
                          <td className="px-3 py-2 text-right">
                            {Number(row.pct_recorrido ?? 0).toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 text-right">
                            {Number(row.pct_usables ?? 0).toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 text-right">
                            {Number(row.pct_afluencia ?? 0).toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 text-right">
                            {Number(row.pct_matricula ?? 0).toFixed(1)}%
                          </td>
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