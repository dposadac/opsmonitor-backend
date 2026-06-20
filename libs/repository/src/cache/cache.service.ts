import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../connection/redis.provider';

/**
 * Redis-backed caching layer for query result caching.
 * Used by repositories/services to memoize expensive reads.
 */
@Injectable()
export class CacheService {
  private readonly defaultTtl = 60; // seconds

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = this.defaultTtl): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /** Get-or-load helper: returns cached value or computes, caches, and returns it. */
  async wrap<T>(
    key: string,
    loader: () => Promise<T>,
    ttlSeconds = this.defaultTtl,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await loader();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  /** Invalidate every key matching a glob pattern (e.g. "events:list:*"). */
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
