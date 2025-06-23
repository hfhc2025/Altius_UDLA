'use client';

import { Loader2 } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const clp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});
const nFmt = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function IndicadoresBanner({ nombre = 'David' }: { nombre?: string }) {
  const { data, error } = useSWR('/api/indicadores', fetcher, {
    refreshInterval: 60_000,
  });

  /* ── hardening ──
     Si data viene como string, array, null, etc.,
     cortamos y mostramos nada (o podrías retornar un <Spinner/>)
  */
  if (data && typeof data !== 'object') {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-[#f5f5f5] px-6 py-4 ring-1 ring-[#e4e4e4]">
      <div className="text-lg font-semibold">
        👋 Bienvenido <span className="text-[#f26f21]">{nombre}</span>
      </div>

      {error && (
        <p className="text-sm text-red-500">Indicadores fuera de línea</p>
      )}

      {!data && !error && (
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      )}

      {data && (
        <ul className="flex flex-wrap items-center gap-4 text-sm">
          <li className="flex items-center gap-1">
            <span className="font-medium text-[#1e1e1e]">UF:</span>
            <span>{nFmt.format((data as any).uf)}</span>
          </li>
          <li className="flex items-center gap-1">
            <span className="font-medium text-[#1e1e1e]">UTM:</span>
            <span>{nFmt.format((data as any).utm)}</span>
          </li>
          <li className="flex items-center gap-1">
            <span className="font-medium text-[#1e1e1e]">Dólar:</span>
            <span>{clp.format((data as any).dolar)}</span>
          </li>
        </ul>
      )}
    </div>
  );
}