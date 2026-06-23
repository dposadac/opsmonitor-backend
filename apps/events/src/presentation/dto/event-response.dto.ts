import { ApiProperty } from '@nestjs/swagger';
import { EventMonitor } from '../../domain/event.entity';

/**
 * Presenter / response model for OpenAPI. Aplana el agregado de dominio a una
 * forma serializable y documentada (mantiene el dominio libre de decoradores).
 */
export class EventResponseDto {
  @ApiProperty({ format: 'uuid' })
  id?: string;

  @ApiProperty({ example: 'trace-abc-123' })
  traceId?: string;

  @ApiProperty({ example: 'api-gateway' })
  originApplication?: string;

  @ApiProperty({ example: 'http.5xx' })
  eventType?: string;

  @ApiProperty({ example: 'Upstream returned 503' })
  description?: string;

  @ApiProperty({ example: 'error', enum: ['low', 'medium', 'high', 'critical'] })
  severity?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  occurredAt?: string;

  static fromDomain(event: EventMonitor): EventResponseDto {
    return {
      id: event.id,
      traceId: event.traceId,
      originApplication: event.originApplication,
      eventType: event.eventType,
      description: event.description,
      severity: event.severity?.value,
      occurredAt: event.occurredAt,
    };
  }
}
