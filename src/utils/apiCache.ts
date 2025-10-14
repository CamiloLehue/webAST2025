/**
 * Advanced API cache with persistence and ETag support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
  promise?: Promise<T>;
}

class APICache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultTTL = 30 * 60 * 1000; // 30 minutos (aumentado)
  private readonly storagePrefix = 'api_cache_';
  private readonly useLocalStorage = true;

  /**
   * Load cache from localStorage
   */
  private loadFromStorage<T>(key: string): CacheEntry<T> | null {
    if (!this.useLocalStorage) return null;
    
    try {
      const stored = localStorage.getItem(this.storagePrefix + key);
      if (stored) {
        const entry = JSON.parse(stored) as CacheEntry<T>;
        console.log(`[Cache] Loaded from localStorage: ${key}`);
        return entry;
      }
    } catch (error) {
      console.warn(`[Cache] Error loading from localStorage:`, error);
    }
    return null;
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage<T>(key: string, entry: CacheEntry<T>): void {
    if (!this.useLocalStorage) return;
    
    try {
      // No guardar la promesa en localStorage
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { promise, ...storableEntry } = entry;
      localStorage.setItem(
        this.storagePrefix + key,
        JSON.stringify(storableEntry)
      );
    } catch (error) {
      console.warn(`[Cache] Error saving to localStorage:`, error);
    }
  }

  /**
   * Get data from cache or fetch it
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const now = Date.now();
    let entry = this.cache.get(key);

    // Si no hay entrada en memoria, intentar cargar de localStorage
    if (!entry) {
      const storedEntry = this.loadFromStorage<T>(key);
      if (storedEntry) {
        this.cache.set(key, storedEntry);
        entry = storedEntry;
      }
    }

    // Si hay una petición en curso, esperar a que termine
    if (entry?.promise) {
      console.log(`[Cache] Esperando petición en curso: ${key}`);
      return entry.promise;
    }

    // Si hay datos en cache y no han expirado, devolverlos
    if (entry?.data && now - entry.timestamp < ttl) {
      console.log(`[Cache] Hit: ${key} (age: ${Math.round((now - entry.timestamp) / 1000)}s)`);
      return entry.data;
    }

    // Si no hay datos o han expirado, hacer la petición
    console.log(`[Cache] Miss: ${key}, fetching...`);
    
    const promise = fetcher();
    
    // Guardar la promesa en cache para evitar peticiones duplicadas
    this.cache.set(key, {
      data: entry?.data || null, // Mantener datos antiguos mientras se actualiza
      timestamp: entry?.timestamp || now,
      promise,
    });

    try {
      const data = await promise;
      
      // Guardar los datos en cache (memoria y localStorage)
      const newEntry: CacheEntry<T> = {
        data,
        timestamp: now,
      };
      
      this.cache.set(key, newEntry);
      this.saveToStorage(key, newEntry);

      return data;
    } catch (error) {
      // Si hay error pero teníamos datos antiguos, devolverlos
      if (entry?.data) {
        console.warn(`[Cache] Error fetching ${key}, using stale data`);
        return entry.data;
      }
      
      // Si no hay datos antiguos, limpiar la entrada de cache
      this.cache.delete(key);
      throw error;
    }
  }

  /**
   * Invalidate cache for a specific key
   */
  invalidate(key: string): void {
    console.log(`[Cache] Invalidating: ${key}`);
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: RegExp): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => {
      if (pattern.test(key)) {
        this.invalidate(key);
      }
    });
  }

  /**
   * Clear all cache (memory and localStorage)
   */
  clear(): void {
    console.log('[Cache] Clearing all cache');
    this.cache.clear();
    
    if (this.useLocalStorage) {
      // Limpiar todas las entradas de cache en localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`[Cache] Removed ${keysToRemove.length} items from localStorage`);
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Prewarm cache - load all from localStorage to memory
   */
  prewarm(): void {
    if (!this.useLocalStorage) return;
    
    console.log('[Cache] Prewarming cache from localStorage...');
    let loaded = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        const cacheKey = key.replace(this.storagePrefix, '');
        const entry = this.loadFromStorage(cacheKey);
        if (entry) {
          this.cache.set(cacheKey, entry);
          loaded++;
        }
      }
    }
    
    console.log(`[Cache] Prewarmed ${loaded} entries`);
  }
}

export const apiCache = new APICache();
