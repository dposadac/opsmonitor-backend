import { ConfigService } from '@nestjs/config';
import { CacheOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

/**
 * Configuración centralizada de la capa de caché (cache-manager) respaldada por
 * Redis a través de Keyv. Reusa las mismas variables de entorno que el resto de
 * conexiones Redis del proyecto.
 */
export function cacheModuleFactory(config: ConfigService): CacheOptions {
  const host = config.get<string>('REDIS_HOST', 'localhost');
  const port = config.get<number>('REDIS_PORT', 6379);
  const password = config.get<string>('REDIS_PASSWORD') || undefined;
  const db = config.get<number>('REDIS_DB', 0);

  const auth = password ? `:${encodeURIComponent(password)}@` : '';
  const url = `redis://${auth}${host}:${port}/${db}`;

  return {
    stores: [createKeyv(url)],
  };
}
