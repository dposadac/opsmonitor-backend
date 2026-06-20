import { AlertRedisEntity } from '@app/repository';
import { Alert, AlertChannel, AlertStatus } from '../domain/alert.entity';

/**
 * Translates between the Alert aggregate and the Redis persistence record.
 */
export class AlertMapper {
  static toDomain(record: AlertRedisEntity): Alert {
    return new Alert({
      id: record.id,
      incidentId: record.incidentId,
      channel: record.channel as AlertChannel,
      message: record.message,
      status: record.status as AlertStatus,
      createdAt: new Date(record.createdAt),
      sentAt: record.sentAt ? new Date(record.sentAt) : undefined,
    });
  }

  static toPersistence(alert: AlertRedisEntity | Alert): AlertRedisEntity {
    return {
      id: alert.id as string,
      incidentId: alert.incidentId,
      channel: alert.channel,
      message: alert.message,
      status: alert.status,
      createdAt:
        alert.createdAt instanceof Date
          ? alert.createdAt.toISOString()
          : alert.createdAt,
      sentAt:
        alert.sentAt instanceof Date ? alert.sentAt.toISOString() : alert.sentAt,
    };
  }
}
