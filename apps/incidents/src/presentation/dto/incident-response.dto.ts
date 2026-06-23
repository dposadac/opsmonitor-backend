import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Incident } from '../../domain/incident.entity';
import { INCIDENT_SEVERITIES } from '../../domain/value-objects/incident-severity.vo';
import { INCIDENT_STATUS } from '../../domain/value-objects/incident-status.vo';

/**
 * Presenter / response model para OpenAPI del agregado Incident.
 */
export class IncidentResponseDto {
  @ApiProperty()
  id?: string;

  @ApiProperty({ example: 'Caída del checkout' })
  title?: string;

  @ApiPropertyOptional({ example: 'El servicio de pagos no responde' })
  description?: string;

  @ApiPropertyOptional({ example: 'checkout-api' })
  affected_app?: string;

  @ApiPropertyOptional({ example: 'jdoe' })
  assignee?: string;

  @ApiProperty({ enum: INCIDENT_STATUS })
  status?: string;

  @ApiProperty({ enum: INCIDENT_SEVERITIES })
  severity?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  created_at?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  updated_at?: Date;

  static fromDomain(incident: Incident): IncidentResponseDto {
    return {
      id: incident.id?.toString(),
      title: incident.title,
      description: incident.description,
      affected_app: incident.affected_app,
      assignee: incident.assignee,
      status: incident.status.value,
      severity: incident.severity.value,
      created_at: incident.created_at,
      updated_at: incident.updated_at,
    };
  }
}
