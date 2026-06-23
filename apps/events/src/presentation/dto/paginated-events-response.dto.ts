import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from '@app/repository';
import { EventMonitor } from '../../domain/event.entity';
import { EventResponseDto } from './event-response.dto';

/** Pagination metadata returned alongside the page of events. */
export class PaginationMetaDto {
  @ApiProperty({ example: 137, description: 'Total de registros que cumplen el filtro' })
  total!: number;

  @ApiProperty({ example: 1, description: 'Página actual (1-based)' })
  page!: number;

  @ApiProperty({ example: 20, description: 'Tamaño de página' })
  limit!: number;

  @ApiProperty({ example: 7, description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage!: boolean;
}

/** Envelope for a paginated list of events. */
export class PaginatedEventsResponseDto {
  @ApiProperty({ type: [EventResponseDto] })
  data!: EventResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  static fromDomain(
    result: PaginatedResult<EventMonitor>,
  ): PaginatedEventsResponseDto {
    return {
      data: result.data.map(EventResponseDto.fromDomain),
      meta: result.meta,
    };
  }
}
