import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

/** DI token for the shared ioredis client. */
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

/**
 * Factory provider that builds a single, pooled ioredis connection used by
 * both the Alerts repository and the caching layer.
 */
export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Redis => {
    return new Redis({
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: config.get<string>('REDIS_PASSWORD') || undefined,
      db: config.get<number>('REDIS_DB', 0),
      lazyConnect: false,
      maxRetriesPerRequest: 3,
    });
  },
};
