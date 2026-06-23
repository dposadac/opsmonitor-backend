import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { IncidentsOrmEntity } from '../entities/typeorm/incident-entity';

/**
 * Centralized PostgreSQL connection options + pooling configuration.
 * Used both by the Nest TypeOrmModule and the standalone CLI DataSource.
 */
export function buildTypeOrmOptions(config: ConfigService): DataSourceOptions {
  return {
    type: 'postgres',
    host: config.get<string>('POSTGRES_HOST', 'localhost'),
    port: config.get<number>('POSTGRES_PORT', 5432),
    username: config.get<string>('POSTGRES_USER', 'opsmonitor'),
    password: config.get<string>('POSTGRES_PASSWORD', 'opsmonitor'),
    database: config.get<string>('POSTGRES_DB', 'opsmonitor'),
    entities: [IncidentsOrmEntity],
    // El esquema se crea con scripts SQL (db/postgres), no con migraciones
    // ni con synchronize.
    synchronize: false,
    // Connection pool configuration
    extra: {
      max: config.get<number>('POSTGRES_POOL_MAX', 10),
      idleTimeoutMillis: 30000,
    },
  };
}

export function typeOrmModuleFactory(config: ConfigService): TypeOrmModuleOptions {
  return {
    ...buildTypeOrmOptions(config),
    autoLoadEntities: true,
  };
}
