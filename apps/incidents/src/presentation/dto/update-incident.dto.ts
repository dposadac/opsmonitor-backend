import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsIn,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { INCIDENT_SEVERITIES } from '../../domain/value-objects/incident-severity.vo';
import { INCIDENT_STATUS } from '../../domain/value-objects/incident-status.vo';

export class UpdateIncidentDto {
    @ApiPropertyOptional({ example: 'Caída del checkout', maxLength: 200 })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

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
        enum: INCIDENT_SEVERITIES,
    })
    @IsOptional()
    @IsIn(INCIDENT_SEVERITIES)
    severity?: string;

    @ApiPropertyOptional({
        enum: INCIDENT_STATUS,
    })
    @IsOptional()
    @IsIn(INCIDENT_STATUS)
    status?: string;
}
