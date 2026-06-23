import { ApiProperty } from '@nestjs/swagger';
import { Alert } from '../../domain/alert.entity';
import { ALERT_PROCESSING_STATUSES } from '../../domain/alert.entity';

/**
 * Presenter / response model para OpenAPI del agregado Alert.
 */
export class AlertResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Id del evento origen' })
  originEvent: string;

  @ApiProperty({ description: 'Aplicación afectada' })
  affectedApplication: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  severity: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Fecha de generación' })
  generatedAt: Date;

  @ApiProperty({ enum: ALERT_PROCESSING_STATUSES, description: 'Estado de procesamiento' })
  processingStatus: string;

  static fromDomain(alert: Alert): AlertResponseDto {
    return {
      id: alert.id as string,
      originEvent: alert.originEvent,
      affectedApplication: alert.affectedApplication,
      severity: alert.severity,
      generatedAt: alert.generatedAt,
      processingStatus: alert.processingStatus,
    };
  }
}
