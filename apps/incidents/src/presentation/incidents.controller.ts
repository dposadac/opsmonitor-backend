import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IncidentsService } from '../application/incidents.service';
import { BulkUpdateIncidentsDto } from './dto/bulk-update-incident.dto';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentResponseDto } from './dto/incident-response.dto';
import { QueryIncidentDto } from './dto/query-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar incidentes (envía el lote a la API de OpsMonitor)',
  })
  @ApiBody({ type: CreateIncidentDto, isArray: true })
  @ApiCreatedResponse({ description: 'Respuesta de la API de incidentes' })
  async create(
    @Body(new ParseArrayPipe({ items: CreateIncidentDto }))
    dtos: CreateIncidentDto[],
  ): Promise<unknown> {
    return this.incidentsService.record(dtos);
  }

  @Get()
  @ApiOperation({ summary: 'Listar/buscar incidentes por campos' })
  @ApiOkResponse({ type: IncidentResponseDto, isArray: true })
  async list(@Query() query: QueryIncidentDto): Promise<IncidentResponseDto[]> {
    const incidents = await this.incidentsService.list(query);
    return incidents.map(IncidentResponseDto.fromDomain);
  }

  @Patch('bulk')
  @ApiOperation({ summary: 'Actualizar varios incidentes' })
  @ApiOkResponse({ type: IncidentResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Incidente no encontrado' })
  async updateMany(
    @Body() dto: BulkUpdateIncidentsDto,
  ): Promise<IncidentResponseDto[]> {
    const incidents = await this.incidentsService.updateMany(dto);
    return incidents.map(IncidentResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un incidente por id' })
  @ApiOkResponse({ type: IncidentResponseDto })
  @ApiNotFoundResponse({ description: 'Incidente no encontrado' })
  async findOne(@Param('id') id: string): Promise<IncidentResponseDto> {
    return IncidentResponseDto.fromDomain(await this.incidentsService.getById(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un incidente' })
  @ApiOkResponse({ type: IncidentResponseDto })
  @ApiNotFoundResponse({ description: 'Incidente no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIncidentDto,
  ): Promise<IncidentResponseDto> {
    return IncidentResponseDto.fromDomain(await this.incidentsService.update(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un incidente' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Incidente no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.incidentsService.remove(id);
  }
}
