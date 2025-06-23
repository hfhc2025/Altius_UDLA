'use client';

import { Filter, TrendingUp, BarChart3, Hash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface CarrerasTopData {
  career: string;
  interesados: number;
}

interface CarrerasTopComboChartProps {
  data: CarrerasTopData[];
  title?: string;
  onFiltersChange?: (filters: { sede?: string; periodo?: string }) => void;
}

export default function CarrerasTopComboChart({
  data,
  title = 'Carreras Top - Interés',
  onFiltersChange,
}: CarrerasTopComboChartProps) {
  // Estados para filtros integrados
  const [sede, setSede] = useState<string>('Todas');
  const [periodo, setPeriodo] = useState<string>('Todos');

  // Opciones de filtros
  const sedes = ['Todas', 'Santiago', 'Viña del Mar', 'Concepción'];
  const periodos = ['Todos', '2025-01', '2025-02', '2025-03', '2025-04'];

  // Procesar datos del gráfico con códigos únicos garantizados y cálculos corregidos
  const chartData = useMemo(() => {
    // Validar que data existe y tiene elementos
    if (!data || data.length === 0) {
      return [];
    }

    // Calcular el total correctamente
    const totalInteresados = data.reduce((sum, item) => {
      const interesados = Number(item.interesados) || 0;
      return sum + interesados;
    }, 0);

    console.log('Total calculado:', totalInteresados); // Debug
    console.log('Data recibida:', data); // Debug

    // Función para crear códigos únicos
    const createUniqueCode = (career: string, index: number, usedCodes: Set<string>): string => {
      // Mapeo específico para carreras conocidas
      const specificCodes: { [key: string]: string } = {
        'Ingeniería Civil Industrial - Continuidad de Estudios': 'ICI',
        'Ingeniería Comercial - Continuidad de Estudios': 'ICO',
        'Contador Auditor - Continuidad de Estudios': 'CAU',
        'TNS en Administración de Empresas': 'TAE',
        'Ingeniería de Ejecución en Administración de Empresas - Continuidad de Estudios': 'IEA'
      };
      
      // Si hay un código específico definido
      if (specificCodes[career]) {
        let baseCode = specificCodes[career];
        let finalCode = baseCode;
        let counter = 1;
        
        // Si el código ya existe, agregar número
        while (usedCodes.has(finalCode)) {
          finalCode = `${baseCode}${counter}`;
          counter++;
        }
        
        usedCodes.add(finalCode);
        return finalCode;
      }
      
      // Generar código basado en palabras clave
      const words = career.split(' ').filter(w => 
        w.length > 2 && 
        !['de', 'en', 'la', 'el', 'del', 'las', 'los', 'con', 'por', 'para', 'continuidad', 'estudios'].includes(w.toLowerCase())
      );
      
      let baseCode = '';
      if (words.length >= 2) {
        baseCode = words.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
      } else if (words.length === 1) {
        baseCode = words[0].substring(0, 2).toUpperCase();
      } else {
        baseCode = 'C';
      }
      
      // Asegurar unicidad
      let finalCode = baseCode;
      let counter = index + 1;
      
      while (usedCodes.has(finalCode)) {
        finalCode = `${baseCode}${counter}`;
        counter++;
      }
      
      usedCodes.add(finalCode);
      return finalCode;
    };

    const usedCodes = new Set<string>();
    
    const processedData = data
      .sort((a, b) => (Number(b.interesados) || 0) - (Number(a.interesados) || 0))
      .slice(0, 6) // Top 6 para mejor legibilidad
      .map((d, index) => {
        const interesados = Number(d.interesados) || 0;
        const shortCode = createUniqueCode(d.career, index, usedCodes);
        
        // Calcular porcentaje correctamente
        const pct = totalInteresados > 0 ? Number(((interesados / totalInteresados) * 100).toFixed(1)) : 0;
        
        console.log(`${shortCode}: ${interesados} de ${totalInteresados} = ${pct}%`); // Debug
        
        return {
          ...d,
          interesados,
          shortCode,
          pct,
          rank: index + 1,
          // Agregar ID único para React keys
          uniqueId: `${shortCode}-${index}-${interesados}`,
        };
      });

    return processedData;
  }, [data]);

  // Manejar cambios de filtros
  const handleSedeChange = (newSede: string) => {
    setSede(newSede);
    console.log('Cambiando sede a:', newSede); // Debug
    onFiltersChange?.({ 
      sede: newSede === 'Todas' ? undefined : newSede, 
      periodo: periodo === 'Todas' ? undefined : periodo 
    });
  };

  const handlePeriodoChange = (newPeriodo: string) => {
    setPeriodo(newPeriodo);
    console.log('Cambiando período a:', newPeriodo); // Debug
    onFiltersChange?.({ 
      sede: sede === 'Todas' ? undefined : sede, 
      periodo: newPeriodo === 'Todas' ? undefined : newPeriodo 
    });
  };

  // Calcular total de interesados mostrados (corregido)
  const totalInteresadosMostrados = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.interesados, 0);
  }, [chartData]);

  // Configuración del gráfico con estilo estadístico y profesional
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderRadius: 8,
      textStyle: {
        color: '#334155',
        fontSize: 12,
        fontWeight: 500,
      },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);',
      formatter: function(params: any) {
        const bar = params.find((p: any) => p.seriesName === 'Interesados');
        const line = params.find((p: any) => p.seriesName === '%');
        const item = chartData.find(d => d.shortCode === bar.name);
        
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: #1e293b; font-size: 13px;">
            ${item?.career || bar.name}
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #4f8df5; border-radius: 2px; margin-right: 8px;"></span>
            <span style="color: #64748b;">Interesados: <strong>${bar.value.toLocaleString()}</strong></span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #f26f21; border-radius: 50%; margin-right: 8px;"></span>
            <span style="color: #64748b;">Porcentaje: <strong>${line.value}%</strong></span>
          </div>
        `;
      }
    },
    legend: {
      data: ['Interesados', '%'],
      top: 15,
      right: 20,
      textStyle: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: 500,
      },
      itemGap: 20,
      itemWidth: 16,
      itemHeight: 10,
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.map((d) => d.shortCode),
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
          width: 1,
        }
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: 600,
        interval: 0, // Mostrar todas las etiquetas
        margin: 12,
      },
      splitLine: {
        show: false,
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Interesados',
        nameTextStyle: {
          color: '#64748b',
          fontSize: 12,
          fontWeight: 500,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
          fontWeight: 500,
          formatter: function(value: number) {
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'k';
            }
            return value.toString();
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9',
            width: 1,
            type: 'solid',
          }
        }
      },
      {
        type: 'value',
        name: '%',
        position: 'right',
        nameTextStyle: {
          color: '#64748b',
          fontSize: 12,
          fontWeight: 500,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
          fontWeight: 500,
          formatter: '{value}%'
        },
        splitLine: {
          show: false,
        }
      },
    ],
    series: [
      {
        name: 'Interesados',
        type: 'bar',
        data: chartData.map((d) => d.interesados),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4f8df5' },
              { offset: 1, color: '#3b7ce0' }
            ]
          },
          shadowColor: 'rgba(79, 141, 245, 0.15)',
          shadowBlur: 4,
          shadowOffsetY: 2,
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(79, 141, 245, 0.25)',
            shadowBlur: 6,
            shadowOffsetY: 3,
          }
        },
        barWidth: '60%',
      },
      {
        name: '%',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: chartData.map((d) => d.pct), // Usar los porcentajes calculados correctamente
        lineStyle: {
          color: '#f26f21',
          width: 3,
          shadowColor: 'rgba(242, 111, 33, 0.15)',
          shadowBlur: 3,
          shadowOffsetY: 1,
        },
        itemStyle: {
          color: '#f26f21',
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(242, 111, 33, 0.2)',
          shadowBlur: 3,
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(242, 111, 33, 0.4)',
            shadowBlur: 5,
          }
        }
      },
    ],
  };

  return (
    <div className="bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-xl overflow-hidden">
      {/* Header minimalista */}
      <div className="bg-gradient-to-r from-slate-50/80 to-white/80 border-b border-slate-200/60 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Título elegante */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50/80 rounded-lg border border-blue-100/60">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Ranking de carreras por nivel de interés
              </p>
            </div>
          </div>

          {/* Filtros elegantes */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-2.5 border border-slate-200/60">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Filtros:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Sede:</label>
              <select
                className="rounded-md border-slate-300 px-2.5 py-1.5 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={sede}
                onChange={(e) => handleSedeChange(e.target.value)}
              >
                {sedes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Período:</label>
              <select
                className="rounded-md border-slate-300 px-2.5 py-1.5 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={periodo}
                onChange={(e) => handlePeriodoChange(e.target.value)}
              >
                {periodos.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="p-5">
        {chartData.length > 0 ? (
          <ReactECharts 
            option={option} 
            style={{ height: 380 }} // Altura optimizada
            opts={{ renderer: 'canvas' }}
          />
        ) : (
          <div className="flex items-center justify-center h-80 text-slate-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p>No hay datos disponibles para mostrar</p>
            </div>
          </div>
        )}
      </div>

      {/* Leyenda de códigos con diseño elegante y keys únicos */}
      {chartData.length > 0 && (
        <div className="bg-slate-50/60 border-t border-slate-200/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Códigos de carreras:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {chartData.map((item) => (
              <div 
                key={item.uniqueId} // Usar uniqueId en lugar de shortCode
                className="flex items-center gap-2 p-2 bg-white/60 rounded-md border border-slate-200/40"
              >
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs min-w-[2.5rem] text-center">
                  {item.shortCode}
                </span>
                <span className="text-slate-600 text-xs leading-tight">
                  {item.career}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer minimalista con total corregido */}
      <div className="bg-gradient-to-r from-slate-50/80 to-white/80 border-t border-slate-200/60 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <BarChart3 className="w-4 h-4" />
            <span>Carreras mostradas: {chartData.length}</span>
          </div>
          <div className="text-slate-500">
            Total interesados: {totalInteresadosMostrados.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
