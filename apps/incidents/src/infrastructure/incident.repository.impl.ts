import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  INCIDENT_MODEL_NAME,
  IncidentSchemaClass,
  MongooseBaseRepository,
} from '@app/repository';
import { Incident } from '../domain/incident.entity';
import { IIncidentRepository } from '../domain/incident.repository';
import { IncidentMapper } from './incident.mapper';

/**
 * Custom Incidents repository: extends the shared Mongoose base repository and
 * implements the domain port. Document <-> aggregate mapping is wired through
 * the base class hooks.
 */
@Injectable()
export class IncidentRepositoryImpl
  extends MongooseBaseRepository<IncidentSchemaClass, Incident>
  implements IIncidentRepository
{
  constructor(
    @InjectModel(INCIDENT_MODEL_NAME)
    private readonly incidentModel: Model<IncidentSchemaClass>,
  ) {
    super(incidentModel);
  }

  protected toDomain(doc: Record<string, any>): Incident {
    return IncidentMapper.toDomain(doc);
  }

  protected toPersistence(domain: Partial<Incident>): Record<string, unknown> {
    return IncidentMapper.toPersistence(domain as Incident);
  }

  save(incident: Incident): Promise<Incident> {
    return this.create(incident);
  }

  async findByStatus(status: string): Promise<Incident[]> {
    return this.findAll({ status });
  }

  remove(id: string): Promise<boolean> {
    return this.delete(id);
  }
}
