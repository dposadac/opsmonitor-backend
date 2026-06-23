import { TypeOrmBaseRepository } from "@app/repository/base/typeorm-base.repository";
import { IncidentsOrmEntity } from "@app/repository/entities/typeorm/incident-entity";
import { Injectable } from "@nestjs/common";
import { IIncidentRepository, IncidentFilters } from "../domain/incident.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Incident } from "../domain/incident.entity";
import { IncidentMapper } from "./incident.mapper";
import { UpdateIncidentDto } from "../presentation/dto/update-incident.dto";
import { IncidentSeverity } from "../domain/value-objects/incident-severity.vo";
import { IncidentStatus } from "../domain/value-objects/incident-status.vo";

@Injectable()
export class IncidentRepositoryImpl
    extends TypeOrmBaseRepository<IncidentsOrmEntity, Incident>
    implements IIncidentRepository
{
    constructor(
        @InjectRepository(IncidentsOrmEntity)
        private readonly incidents: Repository<IncidentsOrmEntity>,
    ) {
        super(incidents);
    }

    protected toDomain(entity: IncidentsOrmEntity): Incident {
        return IncidentMapper.toDomain(entity);
    }

    protected toEntity(domain: Partial<Incident>): DeepPartial<IncidentsOrmEntity> {
        return IncidentMapper.toPersistence(domain);
    }

    save(incident: Incident): Promise<Incident> {
        return this.create(incident);
    }

    remove(id: string): Promise<boolean> {
        return this.delete(id);
    }

    search(filters: IncidentFilters): Promise<Incident[]> {
        const where: Record<string, unknown> = {};
        if (filters.status !== undefined) where.status_incident = filters.status;
        if (filters.severity !== undefined) where.severity = filters.severity;
        if (filters.affected_app !== undefined) where.affected_app = filters.affected_app;
        if (filters.assignee !== undefined) where.assignee = filters.assignee;

        return this.findAll(where);
    }

    updateIncident(id: string, dto: UpdateIncidentDto): Promise<Incident | null> {
        const partial: Partial<Incident> = {};
        if (dto.title !== undefined) partial.title = dto.title;
        if (dto.description !== undefined) partial.description = dto.description;
        if (dto.affected_app !== undefined) partial.affected_app = dto.affected_app;
        if (dto.assignee !== undefined) partial.assignee = dto.assignee;
        if (dto.severity !== undefined) partial.severity = IncidentSeverity.of(dto.severity);
        if (dto.status !== undefined) partial.status = IncidentStatus.of(dto.status);

        // Solo se persisten los campos enviados; el resto del registro permanece
        // intacto. Se estampa updated_at en cada actualización.
        partial.updated_at = new Date();

        return this.update(id, partial);
    }
}