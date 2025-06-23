/* -------------------------------------------------------------------------- */
/*  RootLayout – layout global (SERVER COMPONENT)                             */
/* -------------------------------------------------------------------------- */
import './globals.css'
import type { Metadata } from 'next'
import { inter } from './fonts'   // ⬅️  importa la fuente

export const metadata: Metadata = {
  title: 'Dashboard Operaciones • UDLA 2025',
  description: 'Visualización de KPIs de admisión universitaria UDLA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Aplica la variable de fuente en el <html>
    // Ahora el HTML del servidor y del cliente coinciden al 100 %.
    <html lang="es" className={`h-full dark ${inter.variable}`}>
      <body className="h-full font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}