import { useCallback } from 'react';
import { apiCache } from '../utils/apiCache';

/**
 * Hook para manejar la invalidación de cache
 */
export function useCacheInvalidation() {
  const invalidate = useCallback((key: string) => {
    apiCache.invalidate(key);
  }, []);

  const invalidatePattern = useCallback((pattern: RegExp) => {
    apiCache.invalidatePattern(pattern);
  }, []);

  const clearAll = useCallback(() => {
    apiCache.clear();
  }, []);

  const invalidateAll = useCallback(() => {
    // Invalida todos los endpoints comunes
    apiCache.invalidate('menu-items');
    apiCache.invalidate('blog-posts');
    apiCache.invalidate('home-data');
    apiCache.invalidatePattern(/^paginas/);
  }, []);

  return {
    invalidate,
    invalidatePattern,
    clearAll,
    invalidateAll,
  };
}
