import { useCallback, useMemo, useState } from 'react';
import { apiJson } from '@/lib/api';

export async function apiGet<T = unknown>(path: string): Promise<T> {
  return apiJson<T>(path, { method: 'GET' });
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T = unknown>(path: string, init: RequestInit = {}): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<T>(path, init);
      return data;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Request failed';
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(() => ({ loading, error, request }), [loading, error, request]);
}


