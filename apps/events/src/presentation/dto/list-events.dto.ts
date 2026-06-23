import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { EventListFilters } from '../../domain/event.repository';

/**
 * Query params for the paginated events listing.
 * Page is 1-based; limit is capped to protect the database.
 */
export class ListEventsDto implements EventListFilters {
  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Página (1-based)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20, description: 'Tamaño de página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ example: 'api-gateway', description: 'Aplicación de origen' })
  @IsOptional()
  @IsString()
  originApplication?: string;

  @ApiPropertyOptional({ example: 'http.5xx', description: 'Tipo de evento' })
  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiPropertyOptional({ example: 'error', description: 'Severidad' })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Desde (occurredDateAt >=)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Hasta (occurredDateAt <=)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;
}
