import { DataSource } from 'typeorm';
import { IncidentsOrmEntity } from '../entities/typeorm/incident-entity';

/**
 * Initial data population / test fixtures for the events table.
 */
export async function seedIncidents(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(IncidentsOrmEntity);
  const count = await repo.count();
  if (count > 0) {
    return;
  }
  
  await repo.save([
    repo.create({
      affected_app: 'App1',
      assignee: 'Test1',
      created_at: new Date(),
      description: 'test1',
      severity: 'low',
      status_incident: 'pending',
      title: 'test'
    })
  ]);
}
