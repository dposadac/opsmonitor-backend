import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { EVENT_SEVERITIES } from '../../domain/value-objects/event-severity.vo';

export class CreateEventDto {
  @IsString()
  @MaxLength(120)
  source: string;

  @IsString()
  @MaxLength(80)
  type: string;

  @IsIn(EVENT_SEVERITIES)
  severity: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
