import { ConfigService } from '@nestjs/config';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm.config';

/**
 * Standalone DataSource usado por el seeder (`pnpm seed`).
 * El esquema NO se gestiona aquí: los objetos de BD se crean con los scripts
 * SQL de `db/postgres` vía `pnpm db:init`.
 */
loadEnv();

export default new DataSource(buildTypeOrmOptions(new ConfigService()));
