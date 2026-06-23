import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { INCIDENT_SEVERITIES } from '../../domain/value-objects/incident-severity.vo';
import { INCIDENT_STATUS } from '../../domain/value-objects/incident-status.vo';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Caída del checkout', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ description: 'Descripción' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Aplicación afectada', example: 'checkout-api' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  affected_app?: string;

  @ApiPropertyOptional({ description: 'Responsable asignado', example: 'jdoe' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  assignee?: string;

  @ApiPropertyOptional({
    enum: INCIDENT_SEVERITIES
  })
  @IsOptional()
  @IsIn(INCIDENT_SEVERITIES)
  severity?: string;

  @ApiPropertyOptional({
    enum: INCIDENT_STATUS,
    default: 'open',
  })
  @IsOptional()
  @IsIn(INCIDENT_STATUS)
  status?: string;

  @ApiPropertyOptional({
    description: 'Id del evento que originó el incidente',
    example: '3f6c9a2e-1b4d-4f8a-9c2e-7d5b1a0e6f33',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  idEvent?: string;
}
