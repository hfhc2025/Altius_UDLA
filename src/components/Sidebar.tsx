'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  UserCheck,
  Users,
  Megaphone,
  BrainCircuit,
  ExternalLink,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

/* ———————————————————  Tipos ——————————————————— */
export type TabId =
  | 'home'
  | 'admisiones'
  | 'agentes_admision'
  | 'difusion'
  | 'agentes_difusion'
  | 'diplomado'

/* ———————————————————  Data centralizada ——————————————————— */
const tabs: {
  id: TabId
  label: string
  href: string
  icon: LucideIcon
}[] = [
  { id: 'home',             label: 'Home',              href: '/dashboard',                    icon: Home },
  { id: 'admisiones',       label: 'Admisión Directa',  href: '/dashboard/admission',          icon: UserCheck },
  { id: 'agentes_admision', label: 'Agentes Admisión',  href: '/dashboard/agentes-admision',   icon: Users },
  { id: 'difusion',         label: 'Difusión',          href: '/dashboard/difusion',           icon: Megaphone },
  { id: 'agentes_difusion', label: 'Agentes Difusión',  href: '/dashboard/agentes-difusion',   icon: Users },
  { id: 'diplomado',        label: 'Diplomado',         href: '/dashboard/diplomado',          icon: GraduationCap },
]

/* ———————————————————  Componente ——————————————————— */
interface SidebarProps {
  activeTab?: TabId
  onTabChange?: (tab: TabId) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const pathname = usePathname()

  const smartTab: TabId =
    pathname.startsWith('/dashboard/agentes-admision')  ? 'agentes_admision' :
    pathname.startsWith('/dashboard/agentes-difusion')  ? 'agentes_difusion' :
    pathname.startsWith('/dashboard/admission')         ? 'admisiones' :
    pathname.startsWith('/dashboard/difusion')          ? 'difusion' :
    pathname.startsWith('/dashboard/diplomado')         ? 'diplomado' :
    pathname === '/dashboard'                           ? 'home' :
                                                          'home'

  const currentTab = activeTab ?? smartTab

  return (
    <aside className="relative w-80 min-h-screen bg-white/70 backdrop-blur-xl shadow-xl ring-1 ring-gray-200 rounded-r-3xl flex flex-col p-6">
      {/* Encabezado */}
      <header className="mb-12">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Tu reporte <span className="text-orange-600">UDLA</span>
        </h1>
      </header>

      {/* Navegación */}
      <nav className="flex-1 space-y-4">
        {tabs.map(({ id, label, href, icon: Icon }) => (
          <Link
            key={id}
            href={href}
            onClick={() => onTabChange?.(id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors
              ${currentTab === id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-800 hover:bg-orange-100'}
            `}
          >
            <Icon size={18} className={currentTab === id ? 'text-white' : 'text-orange-600'} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Extras */}
      <div className="pt-8 space-y-4">
        <button
          type="button"
          className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:opacity-90"
        >
          <BrainCircuit size={18} />
          Asistente Inteligente
        </button>

        <Link
          href="https://demre.cl/calendario-admision"
          target="_blank"
          className="flex items-center gap-2 text-sm text-blue-800 font-medium hover:underline"
        >
          <ExternalLink size={16} />
          Proceso Admisión 2026
        </Link>
      </div>
    </aside>
  )
}