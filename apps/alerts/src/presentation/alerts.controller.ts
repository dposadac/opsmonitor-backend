import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AlertsService } from '../application/alerts.service';
import { AlertResponseDto } from './dto/alert-response.dto';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar alertas generadas desde la cola' })
  @ApiOkResponse({ type: AlertResponseDto, isArray: true })
  async list(): Promise<AlertResponseDto[]> {
    const alerts = await this.alertsService.list();
    return alerts.map(AlertResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una alerta por id' })
  @ApiOkResponse({ type: AlertResponseDto })
  @ApiNotFoundResponse({ description: 'Alerta no encontrada' })
  async findOne(@Param('id') id: string): Promise<AlertResponseDto> {
    return AlertResponseDto.fromDomain(await this.alertsService.getById(id));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una alerta' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Alerta no encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.alertsService.remove(id);
  }
}
