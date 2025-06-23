'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

/* ——— Core existentes ——— */
import CountdownBanner from '@/components/CountdownBanner';
import { Footer } from '@/components/Footer';
import IndicadoresBanner from '@/components/IndicadoresBanner';
import { Sidebar } from '@/components/Sidebar';

/* ——— Difusión: lazy-components ——— */
const FunnelDifusion = dynamic(() => import('@/components/AnimatedFunnelDifusion'), { ssr: false });
const KPICards = dynamic(() => import('@/components/KPICards'), { ssr: false });
const TablaSuborigen = dynamic(() => import('@/components/TablaSubOrigen'), { ssr: false });

/* ——— Usa el mismo alias de pestañas que maneja Sidebar ——— */
import type { TabId } from '@/components/Sidebar';

export default function PageDifusion() {
  const [tab, setTab] = useState<TabId>('difusion');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100/50 to-white">
      {/* Gradientes de fondo */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-blue-50/30 via-transparent to-slate-50/20" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-orange-50/20 via-transparent to-transparent" />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={tab} onTabChange={setTab} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 relative">
          {/* Header con saludo personalizado */}
          <IndicadoresBanner nombre="David" />
          <CountdownBanner />

          {/* KPI Cards */}
          <KPICards />

          {/* Funnel de difusión */}
          <FunnelDifusion />

          {/* Tabla Suborigen */}
          <TablaSuborigen />
        </main>
      </div>

      <Footer />
    </div>
  );
}