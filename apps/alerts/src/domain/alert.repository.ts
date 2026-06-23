import { Alert } from './alert.entity';

/** DI token for the Alerts repository port. */
export const ALERT_REPOSITORY = Symbol('ALERT_REPOSITORY');

/**
 * Custom repository port for the Alerts aggregate. Definido por el dominio,
 * implementado en infraestructura sobre MongoDB.
 */
export interface IAlertRepository {
  save(alert: Alert): Promise<Alert>;
  findById(id: string): Promise<Alert | null>;
  findAll(): Promise<Alert[]>;
  update(id: string, alert: Partial<Alert>): Promise<Alert | null>;
  remove(id: string): Promise<boolean>;
}
