'use client';

import React, { useEffect, useMemo, useState } from 'react';

const nFmt = new Intl.NumberFormat('es-CL');
const pct  = (v: number) => `${v.toFixed(1)}%`;

/* ─────────── Tipos ─────────── */
interface RegistroRaw {
  semana: number;
  tipo_base: string;
  total_base: number | string;
  citas: number | string;
  recorrido: number | string;
  usables: number | string;
  afluencias: number | string;
  matriculas: number | string;
}

interface Registro {
  semana: number;
  tipo_base: string;
  total_base: number;
  citas: number;
  recorrido: number;
  usables: number;
  afluencias: number;
  matriculas: number;
  pct_recorrido: number;
  pct_usables: number;
  pct_afluencia: number;
  pct_matricula: number;
}

/* ─────────── Totales que puede devolver a un padre ─────────── */
export interface TotalesSemana {
  citas: number;
  recorrido: number;
  usables: number;
  afluencias: number;
  matriculas: number;
}

interface TablaPorSemanaProps {
  onTotalsChange?: (t: TotalesSemana) => void;
}

const toNum = (v: unknown) => Number(String(v).replaceAll('.', '')) || 0;

/* ─────────── Componente ─────────── */
export default function TablaPorSemanaDiplo({ onTotalsChange }: TablaPorSemanaProps) {
  const [rows, setRows] = useState<Registro[]>([]);
  const [base, setBase] = useState('Todas');
  const [err,  setErr]  = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/kpis/por-semana-diplomado');
        if (!res.ok) throw new Error();
        const json: RegistroRaw[] = await res.json();

        const datos: Registro[] = json.map((o) => {
          const total_base = toNum(o.total_base);
          const recorrido = toNum(o.recorrido);
          const usables = toNum(o.usables);
          const afluencias = toNum(o.afluencias);
          const matriculas = toNum(o.matriculas);
          return {
            semana        : o.semana,
            tipo_base     : o.tipo_base?.trim() || 'Sin tipo',
            total_base,
            citas         : toNum(o.citas),
            recorrido,
            usables,
            afluencias,
            matriculas,
            pct_recorrido : total_base ? (recorrido / total_base) * 100 : 0,
            pct_usables   : recorrido  ? (usables   / recorrido ) * 100 : 0,
            pct_afluencia : recorrido  ? (afluencias/ recorrido ) * 100 : 0,
            pct_matricula : recorrido  ? (matriculas/ recorrido ) * 100 : 0,
          };
        });

        setRows(datos);
      } catch {
        setErr('Error cargando datos');
      }
    })();
  }, []);

  const bases = useMemo(() => {
    return Array.isArray(rows)
      ? ['Todas', ...new Set(rows.map((r) => r.tipo_base))]
      : ['Todas'];
  }, [rows]);

  const lista = useMemo(() => {
    if (base !== 'Todas') return rows.filter((r) => r.tipo_base === base);

    const m = new Map<number, Registro>();
    rows.forEach((r) => {
      const p = m.get(r.semana);
      if (p) {
        p.total_base += r.total_base;
        p.citas      += r.citas;
        p.recorrido  += r.recorrido;
        p.usables    += r.usables;
        p.afluencias += r.afluencias;
        p.matriculas += r.matriculas;
      } else {
        m.set(r.semana, { ...r });
      }
    });

    return Array.from(m.values()).map((r) => ({
      ...r,
      pct_recorrido: r.total_base ? (r.recorrido / r.total_base) * 100 : 0,
      pct_usables  : r.recorrido  ? (r.usables   / r.recorrido ) * 100 : 0,
      pct_afluencia: r.recorrido  ? (r.afluencias/ r.recorrido ) * 100 : 0,
      pct_matricula: r.recorrido  ? (r.matriculas/ r.recorrido ) * 100 : 0,
    }));
  }, [rows, base]);

  const tot = useMemo<TotalesSemana>(() => {
    return lista.reduce(
      (a, r) => ({
        citas      : a.citas      + r.citas,
        recorrido  : a.recorrido  + r.recorrido,
        usables    : a.usables    + r.usables,
        afluencias : a.afluencias + r.afluencias,
        matriculas : a.matriculas + r.matriculas,
      }),
      { citas: 0, recorrido: 0, usables: 0, afluencias: 0, matriculas: 0 }
    );
  }, [lista]);

  useEffect(() => {
    onTotalsChange?.(tot);
  }, [tot, onTotalsChange]);

  if (err) return <p className="text-red-600">{err}</p>;
  if (!rows.length) return <p>Cargando…</p>;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Tipo de base:</label>
        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        >
          {bases.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-6 shadow ring-1 ring-gray-200">
        <table className="min-w-full text-sm text-center">
          <thead>
            <tr className="border-b bg-slate-50">
              {[
                'Semana',
                'Citas',
                'Recorrido',
                'Usables',
                'Afluencias',
                'Matrículas',
                '% Recorrido',
                '% Usables',
                '% Afluencia',
                '% Matrículas',
              ].map((h) => (
                <th key={h} className="py-2 px-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map((r) => (
              <tr key={`${r.semana}-${base}`} className="border-b">
                <td className="py-2 px-3 text-left">Semana {r.semana}</td>
                <td>{nFmt.format(r.citas)}</td>
                <td>{nFmt.format(r.recorrido)}</td>
                <td>{nFmt.format(r.usables)}</td>
                <td>{nFmt.format(r.afluencias)}</td>
                <td>{nFmt.format(r.matriculas)}</td>
                <td>{pct(r.pct_recorrido)}</td>
                <td>{pct(r.pct_usables)}</td>
                <td>{pct(r.pct_afluencia)}</td>
                <td>{pct(r.pct_matricula)}</td>
              </tr>
            ))}
            <tr className="bg-orange-100 font-semibold">
              <td className="py-2 px-3 text-left">TOTALES</td>
              <td>{nFmt.format(tot.citas)}</td>
              <td>{nFmt.format(tot.recorrido)}</td>
              <td>{nFmt.format(tot.usables)}</td>
              <td>{nFmt.format(tot.afluencias)}</td>
              <td>{nFmt.format(tot.matriculas)}</td>
              <td>{pct(tot.recorrido && lista.length ? (tot.recorrido / lista.reduce((s, r) => s + r.total_base, 0)) * 100 : 0)}</td>
              <td>{pct(tot.recorrido ? (tot.usables    / tot.recorrido) * 100 : 0)}</td>
              <td>{pct(tot.recorrido ? (tot.afluencias / tot.recorrido) * 100 : 0)}</td>
              <td>{pct(tot.recorrido ? (tot.matriculas / tot.recorrido) * 100 : 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}