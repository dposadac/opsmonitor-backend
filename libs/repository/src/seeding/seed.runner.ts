import dataSource from '../connection/typeorm.datasource';
import { seedEvents } from './event.seeder';

/**
 * Entry point for `pnpm seed`. Initializes the relational DataSource and
 * runs every registered seeder.
 */
async function run(): Promise<void> {
  await dataSource.initialize();
  try {
    await seedEvents(dataSource);
    // eslint-disable-next-line no-console
    console.log('✓ Seeding complete');
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('✗ Seeding failed', error);
  process.exit(1);
});
