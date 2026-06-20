import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import {
  ALERT_NAMESPACE,
  AlertRedisEntity,
  REDIS_CLIENT,
  RedisBaseRepository,
} from '@app/repository';
import { Alert } from '../domain/alert.entity';
import { IAlertRepository } from '../domain/alert.repository';
import { AlertMapper } from './alert.mapper';

/**
 * Custom Alerts repository: extends the shared Redis base repository and
 * implements the domain port. Record <-> aggregate mapping is wired through
 * the base class hooks; ids are generated here when missing.
 */
@Injectable()
export class AlertRepositoryImpl
  extends RedisBaseRepository<AlertRedisEntity, Alert>
  implements IAlertRepository
{
  protected readonly namespace = ALERT_NAMESPACE;
  protected readonly ttlSeconds = 60 * 60 * 24 * 7; // keep alerts for 7 days

  constructor(@Inject(REDIS_CLIENT) redis: Redis) {
    super(redis);
  }

  protected toDomain(record: AlertRedisEntity): Alert {
    return AlertMapper.toDomain(record);
  }

  protected toRecord(domain: Partial<Alert>): AlertRedisEntity {
    const record = AlertMapper.toPersistence(domain as Alert);
    if (!record.id) {
      record.id = uuid();
    }
    return record;
  }

  save(alert: Alert): Promise<Alert> {
    return this.create(alert);
  }

  remove(id: string): Promise<boolean> {
    return this.delete(id);
  }
}
