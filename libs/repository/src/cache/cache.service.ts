import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

/**
 * Capa de caché para memoizar lecturas costosas.
 * Delegada en cache-manager (respaldado por Redis vía Keyv); los TTL se exponen
 * en segundos hacia los consumidores y se convierten a milisegundos internamente.
 */
@Injectable()
export class CacheService {
  private readonly defaultTtlMs = 60_000; // 60s

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.cache.get<T>(key)) ?? null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.cache.set(key, value, this.toMs(ttlSeconds));
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  /** Get-or-load helper: returns cached value or computes, caches, and returns it. */
  async wrap<T>(
    key: string,
    loader: () => Promise<T>,
    ttlSeconds?: number,
  ): Promise<T> {
    return this.cache.wrap(key, loader, this.toMs(ttlSeconds));
  }

  private toMs(ttlSeconds?: number): number {
    return ttlSeconds ? ttlSeconds * 1000 : this.defaultTtlMs;
  }
}
