'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Section {
  label: string
  href: string
  color: string
}

interface Props {
  sections: Section[]
}

export default function SectionGrid({ sections }: Props) {
  return (
    <div className="grid gap-8 sm:grid-cols-3 w-full max-w-5xl animate-in slide">
      {sections.map(({ label, href, color }) => (
        <Link key={href} href={href} prefetch>
          <motion.article
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all"
          >
            {/* Fondo gradiente */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${color} opacity-60 group-hover:opacity-80 transition`}
            />
            {/* Capa glass */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center justify-center h-48 px-6">
              <h2 className="text-2xl font-semibold tracking-wide">{label}</h2>
              <ArrowRight className="mt-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </motion.article>
        </Link>
      ))}
    </div>
  )
}