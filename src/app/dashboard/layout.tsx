/* -------------------------------------------------------------------------- */
/*  DashboardLayout – layout interno                                         */
/*  NO define <html> ni <body>; solo aplica contenedor y meta.               */
/* -------------------------------------------------------------------------- */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard • UDLA 2025',
  description: 'Módulos de operación para admisión, diplomado y difusión.',
}

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex flex-col">{children}</section>
  )
}