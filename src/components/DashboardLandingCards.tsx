// src/components/DashboardLandingCards.tsx
'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  FileText,
  Calendar,
  DollarSign,
  Target,
  Activity,
  PieChart,
  LineChart,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { motion, Transition } from 'framer-motion'
import { Footer } from './Footer' // Importar el componente Footer

interface DashboardModule {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  kpi: {
    value: string
    label: string
    trend: string
    trendDirection: 'up' | 'down' | 'neutral'
  }
  miniChart: {
    type: 'bar' | 'line' | 'pie'
    data: number[]
  }
}

const dashboardModules: DashboardModule[] = [
  {
    id: 'admision',
    title: 'Admisión',
    description: 'Análisis de procesos de admisión, conversión y tendencias de postulación',
    href: '/dashboard/admission',
    icon: Users,
    kpi: {
      value: '2,847',
      label: 'Postulantes Activos',
      trend: '+12.5%',
      trendDirection: 'up'
    },
    miniChart: {
      type: 'line',
      data: [65, 78, 82, 95, 88, 92, 105]
    }
  },
  {
    id: 'diplomados',
    title: 'Diplomados',
    description: 'Gestión de programas de educación continua, inscripciones y rendimiento académico',
    href: '/dashboard/diplomado',
    icon: GraduationCap,
    kpi: {
      value: '156',
      label: 'Programas Activos',
      trend: '+8.3%',
      trendDirection: 'up'
    },
    miniChart: {
      type: 'bar',
      data: [45, 52, 48, 61, 55, 67, 72]
    }
  },
  {
    id: 'difusion',
    title: 'Difusión',
    description: 'Métricas de comunicación, alcance de campañas y engagement digital',
    href: '/dashboard/difusion',
    icon: TrendingUp,
    kpi: {
      value: '89K',
      label: 'Alcance Mensual',
      trend: '+24.7%',
      trendDirection: 'up'
    },
    miniChart: {
      type: 'line',
      data: [120, 135, 148, 162, 175, 189, 205]
    }
  },
  {
    id: 'financiero',
    title: 'Financiero',
    description: 'Indicadores financieros, ingresos, costos operacionales y proyecciones',
    href: '/dashboard/financiero',
    icon: DollarSign,
    kpi: {
      value: '$2.4M',
      label: 'Ingresos Mensuales',
      trend: '+15.2%',
      trendDirection: 'up'
    },
    miniChart: {
      type: 'bar',
      data: [180, 195, 210, 225, 240, 255, 270]
    }
  },
  {
    id: 'academico',
    title: 'Académico',
    description: 'Rendimiento estudiantil, retención, graduación y calidad académica',
    href: '/dashboard/academico',
    icon: FileText,
    kpi: {
      value: '94.2%',
      label: 'Tasa de Retención',
      trend: '+2.1%',
      trendDirection: 'up'
    },
    miniChart: {
      type: 'line',
      data: [88, 89, 91, 92, 93, 94, 94.2]
    }
  },
  {
    id: 'operaciones',
    title: 'Operaciones',
    description: 'Eficiencia operacional, recursos humanos y gestión de infraestructura',
    href: '/dashboard/operaciones',
    icon: Settings,
    kpi: {
      value: '847',
      label: 'Personal Activo',
      trend: '+3.8%',
      trendDirection: 'up'
    },
    miniChart: {
      type: 'bar',
      data: [820, 825, 830, 835, 840, 845, 847]
    }
  }
]

const quickMetrics = [
  { icon: Users, label: 'Estudiantes Totales', value: '12,847', change: '+5.2%', color: 'text-orange-600' },
  { icon: TrendingUp, label: 'Crecimiento Anual', value: '18.5%', change: '+2.3%', color: 'text-orange-600' },
  { icon: Target, label: 'Satisfacción', value: '4.7/5', change: '+0.2', color: 'text-orange-600' },
  { icon: Activity, label: 'Procesos Activos', value: '24', change: '+6', color: 'text-orange-600' }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    } as Transition, // Explicitly cast to Transition
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
    } as Transition, // Explicitly cast to Transition
  },
}

const MiniChart = ({ type, data }: { type: 'bar' | 'line' | 'pie', data: number[] }) => {
  const max = Math.max(...data)
  const normalized = data.map(d => (d / max) * 100)

  if (type === 'bar') {
    return (
      <div className="flex items-end space-x-1 h-12 w-16">
        {normalized.map((height, i) => (
          <motion.div
            key={i}
            className="bg-orange-500 rounded-sm flex-1"
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ delay: i * 0.1, duration: 0.5 } as Transition}
          />
        ))}
      </div>
    )
  }

  if (type === 'line') {
    return (
      <div className="relative h-12 w-16">
        <svg className="w-full h-full" viewBox="0 0 64 48">
          <motion.polyline
            fill="none"
            stroke="#EA580C"
            strokeWidth="2"
            points={normalized.map((y, x) => `${x * 10},${48 - (y * 0.4)}`).join(' ')}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 } as Transition}
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
      <PieChart className="w-6 h-6 text-orange-600" />
    </div>
  )
}

export default function DashboardLandingCards({ userName = 'Usuario' }: { userName?: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header tipo Power BI */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UDLA Analytics</h1>
                <p className="text-sm text-gray-600">Dashboard Ejecutivo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-transparent text-sm outline-none w-32"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bienvenida y métricas rápidas */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 } as Transition}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido, <span className="text-orange-600">{userName}</span>
            </h2>
            <p className="text-gray-600">
              Resumen ejecutivo · {new Date().toLocaleDateString('es-CL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {quickMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                variants={itemVariants}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Módulos del Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 } as Transition}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Módulos de Análisis</h3>
            <p className="text-gray-600">Accede a los paneles de control especializados</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {dashboardModules.map((module, index) => (
              <motion.div
                key={module.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 300, damping: 20 } as Transition
                }}
                className="group"
              >
                <Link href={module.href} className="block">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                    {/* Header del módulo */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <module.icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Título y descripción */}
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {module.description}
                    </p>

                    {/* KPI principal */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{module.kpi.value}</div>
                        <div className="text-xs text-gray-500">{module.kpi.label}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">{module.kpi.trend}</div>
                        <div className="text-xs text-gray-500">vs. mes anterior</div>
                      </div>
                    </div>

                    {/* Mini gráfico */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-medium">Tendencia</span>
                      <MiniChart type={module.miniChart.type} data={module.miniChart.data} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

