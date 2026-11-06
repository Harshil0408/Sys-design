export class CacheService {
  private memoryCache = new Map<string, { value: string; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return JSON.parse(item.value) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    this.memoryCache.set(key, {
      value: JSON.stringify(value),
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  async del(key: string): Promise<void> {
    this.memoryCache.delete(key);
  }
}

export const cacheService = new CacheService();
