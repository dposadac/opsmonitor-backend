import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { INCIDENT_SEVERITIES } from '../../domain/value-objects/incident-severity.vo';
import { INCIDENT_STATUS } from '../../domain/value-objects/incident-status.vo';

/**
 * Filters supported when listing/searching incidents by fields other than id.
 */
export class QueryIncidentDto {
  @ApiPropertyOptional({ enum: INCIDENT_STATUS })
  @IsOptional()
  @IsIn(INCIDENT_STATUS)
  status?: string;

  @ApiPropertyOptional({ enum: INCIDENT_SEVERITIES })
  @IsOptional()
  @IsIn(INCIDENT_SEVERITIES)
  severity?: string;

  @ApiPropertyOptional({ example: 'checkout-api' })
  @IsOptional()
  @IsString()
  affected_app?: string;

  @ApiPropertyOptional({ example: 'jdoe' })
  @IsOptional()
  @IsString()
  assignee?: string;
}
