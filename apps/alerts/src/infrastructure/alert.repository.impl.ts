import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ALERT_MODEL_NAME,
  AlertSchemaClass,
  MongooseBaseRepository,
} from '@app/repository';
import { Alert } from '../domain/alert.entity';
import { IAlertRepository } from '../domain/alert.repository';
import { AlertMapper } from './alert.mapper';

/**
 * Custom Alerts repository: extiende el base de Mongoose e implementa el puerto
 * del dominio. El mapeo documento <-> agregado se enlaza mediante los hooks.
 */
@Injectable()
export class AlertRepositoryImpl
  extends MongooseBaseRepository<AlertSchemaClass, Alert>
  implements IAlertRepository
{
  constructor(
    @InjectModel(ALERT_MODEL_NAME)
    private readonly alertModel: Model<AlertSchemaClass>,
  ) {
    super(alertModel);
  }

  protected toDomain(doc: Record<string, any>): Alert {
    return AlertMapper.toDomain(doc);
  }

  protected toPersistence(domain: Partial<Alert>): Record<string, unknown> {
    return AlertMapper.toPersistence(domain);
  }

  save(alert: Alert): Promise<Alert> {
    return this.create(alert);
  }

  remove(id: string): Promise<boolean> {
    return this.delete(id);
  }
}
