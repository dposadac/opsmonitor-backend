import { DataSource } from 'typeorm';
import { EventOrmEntity } from '../entities/typeorm/event.orm-entity';

/**
 * Initial data population / test fixtures for the events table.
 */
export async function seedEvents(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(EventOrmEntity);
  const count = await repo.count();
  if (count > 0) {
    return;
  }

  await repo.save([
    repo.create({
      source: 'api-gateway',
      type: 'http.5xx',
      severity: 'error',
      payload: { statusCode: 503, path: '/orders' },
    }),
    repo.create({
      source: 'worker',
      type: 'job.failed',
      severity: 'warning',
      payload: { jobId: 'reindex-42' },
    }),
  ]);
}
