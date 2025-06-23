'use client';

import { useMemo } from 'react';
import useSWR from 'swr';

interface KPITotalesData {
  registros: number;
  recorridos: number;
  conecta: number;
  validados_udla: number;
  registros_validos: number;
  tc_rec_reg: number;
  tc_con_rec: number;
  tc_val_con: number;
}

interface KPICardData {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
  isPercentage: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  const numValue = Number(value);
  if (numValue >= 1_000_000) return `${(numValue / 1_000_000).toFixed(1)}M`;
  if (numValue >= 1_000)     return `${(numValue / 1_000).toFixed(1)}K`;
  return numValue.toLocaleString();
};

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(2)}%`;
};

const KPICard = ({ card }: { card: KPICardData }) => (
  <div
    className={`${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}
    role="article"
    aria-label={`${card.title}: ${card.value}`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    <div className="relative z-10 flex flex-col h-full min-h-[120px]">
      <div className="flex-1">
        <h3 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">{card.value}</h3>
        <div className="w-8 h-1 bg-white/30 rounded-full mb-3" />
        <p className="text-sm md:text-base font-semibold leading-tight opacity-95">{card.title}</p>
      </div>
      {card.subtitle && (
        <div className="mt-4 pt-3 border-t border-white/20">
          <p className="text-xs opacity-80 leading-relaxed">{card.subtitle}</p>
        </div>
      )}
    </div>
    <div className="absolute top-4 right-4">
      <div className={`w-2 h-2 rounded-full ${card.isPercentage ? 'bg-white/40' : 'bg-white/60'}`} />
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-6 animate-pulse min-h-[120px]">
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="h-8 bg-gray-400/50 rounded-lg mb-3 w-20" />
        <div className="w-8 h-1 bg-gray-400/30 rounded-full mb-3" />
        <div className="h-4 bg-gray-400/50 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-400/50 rounded w-1/2" />
      </div>
      <div className="mt-4 pt-3 border-t border-gray-400/20">
        <div className="h-3 bg-gray-400/40 rounded w-full" />
      </div>
    </div>
  </div>
);

export default function KPICards() {
  const { data, error, isLoading } = useSWR<KPITotalesData>(
    '/api/kpi-suborigen-totales',
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false }
  );

  const kpiCards = useMemo<KPICardData[]>(() => {
    if (!data || typeof data !== 'object') return [];

    const registros         = Number(data.registros)         || 0;
    const registrosValidos  = Number(data.registros_validos) || 0;
    const recorridos        = Number(data.recorridos)        || 0;
    const conecta           = Number(data.conecta)           || 0;
    const validadosUdla     = Number(data.validados_udla)    || 0;

    const telefonosErroneos            = registros - registrosValidos;
    const porcentajeTelefonosErroneos  = registros > 0 ? (telefonosErroneos / registros) * 100 : 0;
    const porcentajeValidadosContactado = conecta > 0 ? (registrosValidos / conecta) * 100 : 0;

    const udlaColor = 'bg-gradient-to-br from-orange-600 to-amber-500';

    return [
      { id: 'registros-cargados',         title: 'Registros Cargados',            value: formatNumber(registros),             subtitle: 'Total de registros ingresados a la base',                   color: udlaColor, isPercentage: false },
      { id: 'telefonos-erroneos',         title: 'Registros Teléfonos Erróneos',  value: formatNumber(telefonosErroneos),     subtitle: 'Teléfono ≠ 11 dígitos o no empiece en 569/562',              color: udlaColor, isPercentage: false },
      { id: 'porcentaje-telefonos-erroneos', title: '% Teléfonos Erróneos',          value: formatPercentage(porcentajeTelefonosErroneos), subtitle: 'Teléfonos Erróneos ÷ Registros Cargados', color: udlaColor, isPercentage: true },
      { id: 'recorrido',                  title: 'Recorrido',                     value: formatNumber(recorridos),            subtitle: 'Registros con estado Conecta o No Conecta',                  color: udlaColor, isPercentage: false },
      { id: 'porcentaje-recorrido',       title: '% Recorrido/Registros',         value: formatPercentage(data.tc_rec_reg),   subtitle: 'Recorrido ÷ Registros Cargados',                             color: udlaColor, isPercentage: true },
      { id: 'contactado',                 title: 'Contactado',                    value: formatNumber(conecta),               subtitle: 'Solo los registros Conecta',                                color: udlaColor, isPercentage: false },
      { id: 'porcentaje-contactado',      title: '% Contactado/Recorrido',        value: formatPercentage(data.tc_con_rec),   subtitle: 'Contactado ÷ Recorrido',                                    color: udlaColor, isPercentage: true },
      { id: 'validados-udla',             title: 'Validados UDLA',                value: formatNumber(validadosUdla),         subtitle: 'Conecta + otros estados válidos',                           color: udlaColor, isPercentage: false },
      { id: 'porcentaje-validados-udla',  title: '% Validados UDLA/Contactado',   value: formatPercentage(data.tc_val_con),   subtitle: 'Validados UDLA ÷ Contactado',                               color: udlaColor, isPercentage: true },
      { id: 'validados',                  title: 'Validados',                     value: formatNumber(registrosValidos),      subtitle: 'Teléfonos válidos (11 dígitos, 569/562)',                   color: udlaColor, isPercentage: false },
      { id: 'porcentaje-validados-contactado', title: '% Validados/Contactado',      value: formatPercentage(porcentajeValidadosContactado), subtitle: 'Validados ÷ Contactado', color: udlaColor, isPercentage: true },
    ];
  }, [data]);

  if (error)
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-red-600">
        Error al cargar los KPIs. Intenta nuevamente.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">KPIs Principales</h2>
          <p className="text-sm text-gray-600">Métricas clave de admisión universitaria</p>
        </div>
        {!isLoading && data && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Actualizado automáticamente cada 60 s</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
        {isLoading
          ? Array.from({ length: 11 }).map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map(card => <KPICard key={card.id} card={card} />)}
      </div>

      {!isLoading && kpiCards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos de KPIs disponibles</h3>
          <p className="text-gray-500">Los datos se cargarán automáticamente cuando estén disponibles.</p>
        </div>
      )}
    </div>
  );
}