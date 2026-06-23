import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryEventDto {
  @ApiPropertyOptional({ example: 'api-gateway' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ example: 'http.5xx' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'error' })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ minimum: 1, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
