// File: components/AnimatedFunnelDifusion.tsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AnimatedFunnelDifusion() {
  const { data, error } = useSWR('/api/difusion/funnel', fetcher, {
    refreshInterval: 120_000,
  });

  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setSteps(data);
    }
  }, [data]);

  if (error) return <p className="text-red-500 p-4">Error embudo</p>;
  if (!data || !Array.isArray(data)) return <p className="text-slate-500 p-4">Cargando embudo…</p>;

  const max = steps[0]?.value || 1;

  return (
    <div className="space-y-1">
      {steps.map((s, i) => (
        <motion.div
          key={s.label ?? `step-${i}`}
          initial={{ width: 0 }}
          animate={{ width: `${(s.value / max) * 100}%` }}
          transition={{ duration: 0.8, delay: i * 0.1 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-lg px-3 py-2 shadow"
        >
          <div className="flex justify-between text-sm font-medium">
            <span>{s.label}</span>
            <span>{Number(s.value).toLocaleString()}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}