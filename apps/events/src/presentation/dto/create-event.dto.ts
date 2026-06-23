import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { EVENT_SEVERITIES } from '../../domain/value-objects/event-severity.vo';

export class CreateEventDto {
  @ApiProperty({ example: 'App1', maxLength: 120, description: 'Aplicación origen' })
  @IsString()
  originApplication?: string;

  @ApiProperty({ example: 'http.5xx', maxLength: 80, description: 'Tipo de evento' })
  @IsString()
  eventType?: string;

  @ApiProperty({ enum: EVENT_SEVERITIES, example: 'critical', description: 'Severidad' })
  @IsIn(EVENT_SEVERITIES)
  severity?: string;

  
  @ApiProperty({ example: 'http.5xx', maxLength: 80, description: 'Descripción' })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Fecha y hora ocurrencia', example: new Date().toISOString() })
  ocurredDate?: string;
}