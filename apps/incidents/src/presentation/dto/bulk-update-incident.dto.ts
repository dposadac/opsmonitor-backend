import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateIncidentDto } from './update-incident.dto';

/** A single incident update inside a bulk request (id + fields to change). */
export class BulkUpdateIncidentItemDto extends UpdateIncidentDto {
  @ApiProperty({ description: 'Id del incidente a actualizar' })
  @IsString()
  @IsNotEmpty()
  id!: string;
}

/** Payload to update several incidents in a single request. */
export class BulkUpdateIncidentsDto {
  @ApiProperty({ type: [BulkUpdateIncidentItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateIncidentItemDto)
  items!: BulkUpdateIncidentItemDto[];
}
