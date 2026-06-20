import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { config as loadEnv } from 'dotenv';
import { Client } from 'pg';

/**
 * Inicializa los objetos de BD ejecutando los scripts SQL de `db/postgres`
 * en orden alfabético. Reemplaza a las migraciones de TypeORM: el esquema se
 * define y versiona mediante archivos `.sql` idempotentes.
 *
 * Uso: pnpm db:init
 */
loadEnv();

const SQL_DIR = join(__dirname, '..', '..', 'db', 'postgres');

async function run(): Promise<void> {
  const client = new Client({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? 'opsmonitor',
    password: process.env.POSTGRES_PASSWORD ?? 'opsmonitor',
    database: process.env.POSTGRES_DB ?? 'opsmonitor',
  });

  await client.connect();
  try {
    const files = readdirSync(SQL_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = readFileSync(join(SQL_DIR, file), 'utf8');
      // eslint-disable-next-line no-console
      console.log(`→ ${file}`);
      await client.query(sql);
    }
    // eslint-disable-next-line no-console
    console.log('✓ Esquema inicializado');
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('✗ Inicialización de esquema fallida', error);
  process.exit(1);
});
