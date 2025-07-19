/**
 * Client-side caching utilities for performance optimization
 * Provides in-memory and localStorage caching with TTL support
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 100 // Maximum number of items to cache

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  size(): number {
    return this.cache.size
  }
}

class LocalStorageCache {
  private prefix = 'hoppn_cache_'

  set<T>(key: string, data: T, ttlMs: number = 30 * 60 * 1000): void {
    if (typeof window === 'undefined') return

    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs
      }
      
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to cache item in localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null

    try {
      const itemStr = localStorage.getItem(this.prefix + key)
      if (!itemStr) return null

      const item: CacheItem<T> = JSON.parse(itemStr)
      
      // Check if item has expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(key)
        return null
      }

      return item.data
    } catch (error) {
      console.warn('Failed to retrieve item from localStorage:', error)
      return null
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.warn('Failed to delete item from localStorage:', error)
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return
    
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error)
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }
}

// Cache instances
export const memoryCache = new MemoryCache()
export const localStorageCache = new LocalStorageCache()

// Cache utility functions
export const cache = {
  // Memory cache for frequently accessed data
  memory: memoryCache,
  
  // Persistent cache for less frequently accessed data
  persistent: localStorageCache,
  
  // Combined cache strategy: try memory first, then localStorage
  get<T>(key: string): T | null {
    let data = memoryCache.get<T>(key)
    if (data) return data

    data = localStorageCache.get<T>(key)
    if (data) {
      // Promote to memory cache for faster access
      memoryCache.set(key, data, 5 * 60 * 1000) // 5 minutes in memory
    }
    
    return data
  },

  set<T>(key: string, data: T, memoryTtl = 5 * 60 * 1000, persistentTtl = 30 * 60 * 1000): void {
    memoryCache.set(key, data, memoryTtl)
    localStorageCache.set(key, data, persistentTtl)
  },

  delete(key: string): void {
    memoryCache.delete(key)
    localStorageCache.delete(key)
  },

  clear(): void {
    memoryCache.clear()
    localStorageCache.clear()
  }
}

// Async cache wrapper for API calls
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  generateKey: (...args: T) => string,
  ttl?: number
) {
  return async (...args: T): Promise<R> => {
    const key = generateKey(...args)
    
    // Try to get from cache first
    const cached = cache.get<R>(key)
    if (cached) {
      return cached
    }

    // Execute function and cache result
    const result = await fn(...args)
    cache.set(key, result, ttl)
    
    return result
  }
}

// Utility function for cached fetch
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try cache first
  const cached = cache.get<T>(key)
  if (cached) {
    return cached
  }

  // Fetch fresh data
  const freshData = await fetcher()
  cache.set(key, freshData, ttl)
  
  return freshData
}

// Cache cleanup on app start
if (typeof window !== 'undefined') {
  // Clean expired items on app start
  setTimeout(() => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('hoppn_cache_')) {
          const item = localStorage.getItem(key)
          if (item) {
            try {
              const parsed = JSON.parse(item)
              if (Date.now() - parsed.timestamp > parsed.ttl) {
                localStorage.removeItem(key)
              }
            } catch {
              localStorage.removeItem(key)
            }
          }
        }
      })
    } catch (error) {
      console.warn('Failed to clean expired cache items:', error)
    }
  }, 1000)
}