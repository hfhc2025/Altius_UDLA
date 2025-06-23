import useSWR from 'swr';

type Carrera = { career: string; interesados: number };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Options {
  limit?: number;
  sede?: string;      // ej. 'Santiago'
  periodo?: string;   // ej. '2025-03-01'
}

export function useTopCarreras({ limit = 10, sede, periodo }: Options = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (sede)    params.append('sede', sede);
  if (periodo) params.append('periodo', periodo);

  const { data, error, isLoading } = useSWR<Carrera[]>(
    `/api/carreras/top?${params.toString()}`,
    fetcher,
    { refreshInterval: 60_000 }
  );

  return { carreras: data ?? [], isLoading, error };
}