import { config as loadEnv } from 'dotenv';
import { createConnection } from 'mongoose';
import dataSource from '../connection/typeorm.datasource';
import { seedIncidents } from './incident.seeder';
import { seedEvents } from './event.seeder';

loadEnv();

/**
 * Entry point for `pnpm seed`. Initializes the relational DataSource and
 * the Mongo connection, then runs every registered seeder.
 */
async function run(): Promise<void> {
  await dataSource.initialize();
  const mongoConnection = createConnection(process.env.MONGO_URI ?? '', {
    serverSelectionTimeoutMS: 5000
  });
  await mongoConnection.asPromise();
  try {
    await seedIncidents(dataSource);
    await seedEvents(mongoConnection);
    console.log('✓ Seeding complete');
  } finally {
    await dataSource.destroy();
    await mongoConnection.close();
  }
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('✗ Seeding failed', error);
  process.exit(1);
});
