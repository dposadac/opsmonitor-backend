import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { EVENT_SEVERITIES } from '../../domain/value-objects/event-severity.vo';

export class UpdateEventDto {

    @ApiPropertyOptional({ description: 'ID Evento' })
    @IsOptional()
    @IsString()
    eventId?: string;

    @ApiPropertyOptional({ example: 'App1', maxLength: 120, description: 'Aplicación origen' })
    @IsOptional()
    @IsString()
    @MaxLength(120)
    originApplication?: string;

    @ApiPropertyOptional({ example: 'http.5xx', maxLength: 80, description: 'Tipo de evento' })
    @IsOptional()
    @IsString()
    @MaxLength(80)
    eventType?: string;

    @ApiPropertyOptional({ enum: EVENT_SEVERITIES, example: 'critical', description: 'Severidad' })
    @IsOptional()
    @IsIn(EVENT_SEVERITIES)
    severity?: string;

    @ApiPropertyOptional({ example: 'http.5xx', maxLength: 80, description: 'Descripción' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    description?: string;

    @ApiPropertyOptional({ description: 'Fecha y hora ocurrencia', example: new Date().toISOString() })
    @IsOptional()
    @IsString()
    ocurredDate?: string;
}