import { useState, useEffect, useRef, useMemo } from 'react';

interface UseOptimizedDataOptions<T> {
  fetcher: () => Promise<T>;
  cacheKey: string;
  staleTime?: number; // Tiempo en ms antes de considerar los datos obsoletos
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

/**
 * Hook optimizado para cargar datos con cache inteligente
 * Similar a React Query pero más ligero
 */
export function useOptimizedData<T>({
  fetcher,
  cacheKey,
  staleTime = 5 * 60 * 1000, // 5 minutos por defecto
  refetchOnMount = false,
  refetchOnWindowFocus = false,
  enabled = true,
}: UseOptimizedDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  // Determinar si los datos están obsoletos
  const isStale = useMemo(() => {
    if (!lastFetchTimeRef.current) return true;
    return Date.now() - lastFetchTimeRef.current > staleTime;
  }, [staleTime]);

  const fetchData = async (force = false) => {
    if (!enabled) return;
    
    // Si no es forzado y los datos no están obsoletos, no refetch
    if (!force && !isStale && data) {
      console.log(`[useOptimizedData] Skipping fetch for ${cacheKey} - data is fresh`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetcher();

      if (isMountedRef.current) {
        setData(result);
        lastFetchTimeRef.current = Date.now();
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Efecto para cargar datos al montar
  useEffect(() => {
    isMountedRef.current = true;

    const shouldFetch = enabled && (refetchOnMount || !data || isStale);
    
    if (shouldFetch) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]); // Solo depende de enabled - fetchData y data se manejan internamente

  // Efecto para refetch en window focus
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      if (isStale) {
        console.log(`[useOptimizedData] Window focus - refetching stale data for ${cacheKey}`);
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchOnWindowFocus, enabled, isStale, cacheKey]); // fetchData es estable

  const refetch = () => fetchData(true);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}
