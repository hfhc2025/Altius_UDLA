'use client'

import { motion } from 'framer-motion'
import {
  Database, Footprints, MessageCircle,
  CalendarCheck, TrendingUp, GraduationCap
} from 'lucide-react'
import { useMemo } from 'react'

export interface KPI {
  tipo_base: string
  base_total: number
  recorrido: number
  contactados: number
  citas: number
  afluencias: number
  matriculas: number
}

interface Stage {
  key: string
  label: string
  value: number
  percentage: number
  conversionRate: number
  icon: React.ReactNode
  widthPercentage: number
  color: string
  gradient: string
  textColor: string
}

interface Props {
  kpis: KPI[]
  tipoBase: 'Todas' | 'Lead' | 'Stock'
}

const pct  = (cur: number, base: number) => base === 0 ? 0 : (cur / base) * 100
const conv = (cur: number, prev: number) => prev === 0 ? 0 : (cur / prev) * 100
const safeNum = (val: any) => Number.isFinite(Number(val)) ? Number(val) : 0

const FunnelStage = ({ stage, index, isLast }: {
  stage: Stage; index: number; isLast: boolean
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: .5, delay: index * .15, ease: [.22, 1, .36, 1] }}
    className="relative w-full mb-4"
  >
    <div className="relative group">
      <motion.div
        whileHover={{
          scale: 1.02,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1)'
        }}
        transition={{ duration: .2 }}
        className="relative overflow-hidden backdrop-blur-sm mx-auto"
        style={{
          width: `${stage.widthPercentage}%`,
          minWidth: 250,
          height: 100,
          borderRadius: 8,
          background: stage.gradient,
          margin: '0 auto',
          color: stage.textColor,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)'
        }}
      >
        <div className="relative z-10 flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{ background: 'rgba(255,255,255,.85)', color: stage.color, width: 36, height: 36 }}
              className="p-2 rounded-full shadow-md flex items-center justify-center"
            >
              {stage.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold truncate">{stage.label}</h3>
              <div className="text-xs font-medium opacity-90">Etapa {index + 1}</div>
            </div>
            <div className="text-xl font-bold">
              {safeNum(stage.conversionRate).toFixed(1)}%
            </div>
          </div>

          <div className="flex items-center justify-center flex-1">
            <motion.div
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: .5, delay: index * .15 + .3, ease: 'easeOut' }}
              className="text-2xl font-black"
            >
              {safeNum(stage.value).toLocaleString('es-CL')}
            </motion.div>
          </div>

          <div className="mt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold">Progreso</span>
              <span className="text-xs font-bold">
                {safeNum(stage.percentage).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/40 rounded-full h-2 shadow-inner">
              <motion.div
                style={{ background: stage.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stage.percentage, 100)}%` }}
                transition={{ duration: 1, delay: index * .15 + .5, ease: 'easeOut' }}
                className="h-2 rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>

      {!isLast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * .15 + .3 }}
          className="w-full flex justify-center my-1"
        >
          <div
            className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px]"
            style={{ borderTopColor: stage.color }}
          />
        </motion.div>
      )}
    </div>
  </motion.div>
)

export default function AnimatedFunnelDiplomado({ kpis, tipoBase }: Props) {
  const fila = useMemo(() => {
    if (!Array.isArray(kpis)) return null
    return kpis.find(k => k.tipo_base === (tipoBase === 'Todas' ? 'Total' : tipoBase))
  }, [kpis, tipoBase])

  if (!fila) return null

  const v = fila
  const wPct   = [95, 85, 75, 65, 55, 45]
  const colors = ['#E65C09', '#FF6C30', '#FF8A5C', '#DC2626', '#0EA5E9', '#7C3AED']
  const grad   = [
    'linear-gradient(90deg,#E65C09,#FF6C30)',
    'linear-gradient(90deg,#FF6C30,#FF8A5C)',
    'linear-gradient(90deg,#FF8A5C,#FFAA80)',
    'linear-gradient(90deg,#DC2626,#EF4444)',
    'linear-gradient(90deg,#0EA5E9,#38BDF8)',
    'linear-gradient(90deg,#7C3AED,#8B5CF6)'
  ]
  const txt = ['#fff', '#fff', '#000', '#fff', '#fff', '#fff']

  const stages: Stage[] = [
    { key: 'base', label: 'Base Total', value: v.base_total,
      percentage: 100, conversionRate: 100,
      icon: <Database size={20} />, widthPercentage: wPct[0],
      color: colors[0], gradient: grad[0], textColor: txt[0] },
    { key: 'reco', label: 'Recorrido', value: v.recorrido,
      percentage: pct(v.recorrido, v.base_total),
      conversionRate: conv(v.recorrido, v.base_total),
      icon: <Footprints size={20} />, widthPercentage: wPct[1],
      color: colors[1], gradient: grad[1], textColor: txt[1] },
    { key: 'cont', label: 'Contactados', value: v.contactados,
      percentage: pct(v.contactados, v.base_total),
      conversionRate: conv(v.contactados, v.recorrido),
      icon: <MessageCircle size={20} />, widthPercentage: wPct[2],
      color: colors[2], gradient: grad[2], textColor: txt[2] },
    { key: 'cita', label: 'Citas', value: v.citas,
      percentage: pct(v.citas, v.base_total),
      conversionRate: conv(v.citas, v.contactados),
      icon: <CalendarCheck size={20} />, widthPercentage: wPct[3],
      color: colors[3], gradient: grad[3], textColor: txt[3] },
    { key: 'aflu', label: 'Afluencias', value: v.afluencias,
      percentage: pct(v.afluencias, v.base_total),
      conversionRate: conv(v.afluencias, v.citas),
      icon: <TrendingUp size={20} />, widthPercentage: wPct[4],
      color: colors[4], gradient: grad[4], textColor: txt[4] },
    { key: 'matr', label: 'Matrículas', value: v.matriculas,
      percentage: pct(v.matriculas, v.base_total),
      conversionRate: conv(v.matriculas, v.afluencias),
      icon: <GraduationCap size={20} />, widthPercentage: wPct[5],
      color: colors[5], gradient: grad[5], textColor: txt[5] }
  ]

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <div className="w-full h-1 bg-gradient-to-r from-[#E65C09] to-[#FF6C30] rounded-full mb-8" />

      <div className="flex flex-col items-center space-y-1 max-w-2xl mx-auto">
        {stages.map((s, i) => (
          <FunnelStage key={s.key} stage={s} index={i} isLast={i === stages.length - 1} />
        ))}
      </div>
    </div>
  )
}