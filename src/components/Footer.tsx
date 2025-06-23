/* -------------------------------------------------------------------------- */
/*  Footer.tsx – Footer oficial Altius Ignite                  */
/* -------------------------------------------------------------------------- */
'use client'

import * as React from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
// import { cn } from '@/lib/utils' // Comentado porque no tengo acceso a esta utilidad

// Función cn simplificada para este ejemplo
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ')

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function Footer({ className = '', ...props }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'bg-gray-900 text-white py-8 mt-12 w-full',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <div className="text-sm font-semibold">Universidad de Las Américas</div>
              <div className="text-xs text-gray-400">
                © {currentYear} · Desarrollado por&nbsp;
                <Link
                  href="https://www.altiusignite.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Altius Ignite
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400">v2.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

