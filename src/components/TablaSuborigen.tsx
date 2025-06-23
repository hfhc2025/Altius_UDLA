'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';

interface KPISuborigenData {
  suborigen: string;
  registros: number;
  recorridos: number;
  conecta: number;
  validados: number;
  registros_validos: number;
  tc_rec_reg: number;
  tc_con_rec: number;
  tc_val_con: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  
  const numValue = Number(value);
  
  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  }
  if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`;
  }
  return numValue.toLocaleString();
};

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(1)}%`;
};

const getPercentageColor = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return 'text-gray-500';
  const numValue = Number(value);
  if (numValue >= 75) return 'text-emerald-600';
  if (numValue >= 50) return 'text-amber-600';
  return 'text-rose-600';
};

const SkeletonRow = () => (
  <tr className="border-b border-gray-200">
    {Array.from({ length: 9 }).map((_, index) => (
      <td key={index} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
    ))}
  </tr>
);

export default function TablaSuborigen() {
  const { data, error, isLoading } = useSWR<KPISuborigenData[]>(
    '/api/kpi-suborigen',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  // Estado para el filtro de suborígenes
  const [selectedSuborigenes, setSelectedSuborigenes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener lista única de suborígenes para el filtro
  const availableSuborigenes = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const uniqueSuborigenes = [...new Set(data.map(item => item.suborigen))];
    return uniqueSuborigenes.sort();
  }, [data]);

  // Filtrar suborígenes basándose en el término de búsqueda
  const filteredSuborigenes = useMemo(() => {
    if (!searchTerm.trim()) return availableSuborigenes;
    
    return availableSuborigenes.filter(suborigen =>
      suborigen.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableSuborigenes, searchTerm]);

  const { processedData, totals } = useMemo(() => {
    if (!data || data.length === 0) {
      return { processedData: [], totals: null };
    }

    // Agrupar datos por suborigen
    const groupedData = data.reduce((acc, item) => {
      const key = item.suborigen;
      
      if (!acc[key]) {
        acc[key] = {
          suborigen: key,
          registros: 0,
          recorridos: 0,
          conecta: 0,
          validados: 0,
          registros_validos: 0,
          tc_rec_reg: 0,
          tc_con_rec: 0,
          tc_val_con: 0,
        };
      }
      
      // Sumar valores numéricos
      acc[key].registros += Number(item.registros) || 0;
      acc[key].recorridos += Number(item.recorridos) || 0;
      acc[key].conecta += Number(item.conecta) || 0;
      acc[key].validados += Number(item.validados) || 0;
      acc[key].registros_validos += Number(item.registros_validos) || 0;
      
      return acc;
    }, {} as Record<string, KPISuborigenData>);

    // Convertir a array y recalcular porcentajes
    let processedData = Object.values(groupedData).map(item => ({
      ...item,
      tc_rec_reg: item.registros > 0 ? (item.recorridos / item.registros) * 100 : 0,
      tc_con_rec: item.recorridos > 0 ? (item.conecta / item.recorridos) * 100 : 0,
      tc_val_con: item.conecta > 0 ? (item.validados / item.conecta) * 100 : 0,
    })).sort((a, b) => b.registros - a.registros); // Ordenar por registros de mayor a menor

    // Aplicar filtro de suborígenes si hay selecciones
    if (selectedSuborigenes.length > 0) {
      processedData = processedData.filter(item => 
        selectedSuborigenes.includes(item.suborigen)
      );
    }

    // Calcular totales basados en datos filtrados
    const totals = {
      suborigen: 'TOTAL',
      registros: processedData.reduce((sum, item) => sum + (Number(item.registros) || 0), 0),
      recorridos: processedData.reduce((sum, item) => sum + (Number(item.recorridos) || 0), 0),
      conecta: processedData.reduce((sum, item) => sum + (Number(item.conecta) || 0), 0),
      validados: processedData.reduce((sum, item) => sum + (Number(item.validados) || 0), 0),
      registros_validos: processedData.reduce((sum, item) => sum + (Number(item.registros_validos) || 0), 0),
      tc_rec_reg: 0,
      tc_con_rec: 0,
      tc_val_con: 0,
    };

    // Recalcular porcentajes para totales
    totals.tc_rec_reg = totals.registros > 0 ? (totals.recorridos / totals.registros) * 100 : 0;
    totals.tc_con_rec = totals.recorridos > 0 ? (totals.conecta / totals.recorridos) * 100 : 0;
    totals.tc_val_con = totals.conecta > 0 ? (totals.validados / totals.conecta) * 100 : 0;

    return { processedData, totals };
  }, [data, selectedSuborigenes]);

  // Función para manejar la selección/deselección de suborígenes
  const handleSuborigenToggle = (suborigen: string) => {
    setSelectedSuborigenes(prev => {
      if (prev.includes(suborigen)) {
        return prev.filter(s => s !== suborigen);
      } else {
        return [...prev, suborigen];
      }
    });
  };

  // Función para seleccionar todos los suborígenes (solo los filtrados)
  const handleSelectAll = () => {
    if (selectedSuborigenes.length === filteredSuborigenes.length && filteredSuborigenes.every(s => selectedSuborigenes.includes(s))) {
      // Deseleccionar todos los filtrados
      setSelectedSuborigenes(prev => prev.filter(s => !filteredSuborigenes.includes(s)));
    } else {
      // Seleccionar todos los filtrados
      setSelectedSuborigenes(prev => {
        const newSelection = [...prev];
        filteredSuborigenes.forEach(s => {
          if (!newSelection.includes(s)) {
            newSelection.push(s);
          }
        });
        return newSelection;
      });
    }
  };

  // Función para limpiar todos los filtros
  const handleClearAll = () => {
    setSelectedSuborigenes([]);
    setSearchTerm('');
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          Error al cargar los datos. Intenta nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtro de Suborígenes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Filtrar por Suborigen</h3>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              disabled={filteredSuborigenes.length === 0}
            >
              {selectedSuborigenes.length === filteredSuborigenes.length && filteredSuborigenes.every(s => selectedSuborigenes.includes(s)) 
                ? 'Deseleccionar' 
                : 'Seleccionar Todo'}
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
        
        {/* Campo de búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar suborigen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-9"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Lista de suborígenes */}
        <div className="border border-gray-200 rounded-md max-h-48 overflow-y-auto bg-gray-50">
          {filteredSuborigenes.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchTerm ? 'No se encontraron suborígenes' : 'No hay suborígenes disponibles'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSuborigenes.map((suborigen) => (
                <label
                  key={suborigen}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSuborigenes.includes(suborigen)}
                    onChange={() => handleSuborigenToggle(suborigen)}
                    className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 flex-1" title={suborigen}>
                    {suborigen}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* Información de selección */}
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-600">
          <span>
            {selectedSuborigenes.length > 0 
              ? `${selectedSuborigenes.length} seleccionado${selectedSuborigenes.length > 1 ? 's' : ''}`
              : 'Ninguno seleccionado'
            }
          </span>
          <span>
            Mostrando {filteredSuborigenes.length} de {availableSuborigenes.length} suborígenes
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-orange-500 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-sm">Suborigen</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Registros</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Recorridos</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Conecta</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Validados</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Reg.Válidos</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Tc% Rec/Reg</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Tc% Con/Rec</th>
              <th className="px-4 py-3 text-right font-semibold text-sm">Tc% Val/Con</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : (
              <>
                {processedData.map((item, index) => (
                  <tr
                    key={item.suborigen}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.suborigen}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                      {formatNumber(item.registros)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                      {formatNumber(item.recorridos)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                      {formatNumber(item.conecta)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                      {formatNumber(item.validados)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                      {formatNumber(item.registros_validos)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono font-semibold ${getPercentageColor(item.tc_rec_reg)}`}>
                      {formatPercentage(item.tc_rec_reg)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono font-semibold ${getPercentageColor(item.tc_con_rec)}`}>
                      {formatPercentage(item.tc_con_rec)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono font-semibold ${getPercentageColor(item.tc_val_con)}`}>
                      {formatPercentage(item.tc_val_con)}
                    </td>
                  </tr>
                ))}
                {totals && (
                  <tr className="bg-gray-800 text-white border-t-2 border-gray-400">
                    <td className="px-4 py-3 text-sm font-bold">
                      {totals.suborigen}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold">
                      {formatNumber(totals.registros)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold">
                      {formatNumber(totals.recorridos)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold">
                      {formatNumber(totals.conecta)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold">
                      {formatNumber(totals.validados)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold">
                      {formatNumber(totals.registros_validos)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold text-white">
                      {formatPercentage(totals.tc_rec_reg)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold text-white">
                      {formatPercentage(totals.tc_con_rec)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-bold text-white">
                      {formatPercentage(totals.tc_val_con)}
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
        </div>
        {!isLoading && processedData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
}