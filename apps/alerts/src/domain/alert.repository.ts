import { Alert } from './alert.entity';

/** DI token for the Alerts repository port. */
export const ALERT_REPOSITORY = Symbol('ALERT_REPOSITORY');

/**
 * Custom repository port for the Alerts aggregate.
 */
export interface IAlertRepository {
  save(alert: Alert): Promise<Alert>;
  findById(id: string): Promise<Alert | null>;
  findAll(): Promise<Alert[]>;
  update(id: string, alert: Alert): Promise<Alert | null>;
  remove(id: string): Promise<boolean>;
}
