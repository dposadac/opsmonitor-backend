import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from '../application/events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { ListEventsDto } from './dto/list-events.dto';
import { PaginatedEventsResponseDto } from './dto/paginated-events-response.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo evento' })
  @ApiCreatedResponse({ type: EventResponseDto })
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {
    return EventResponseDto.fromDomain(await this.eventsService.record(dto));
  }

  @Get()
  @ApiOperation({ summary: 'Buscar eventos (con filtros y paginación)' })
  @ApiOkResponse({ type: EventResponseDto, isArray: true })
  async search(@Query() query: QueryEventDto): Promise<EventResponseDto[]> {
    const events = await this.eventsService.search(query);
    return events.map(EventResponseDto.fromDomain);
  }

  @Get('list')
  @ApiOperation({ summary: 'Listar eventos paginados (paginación backend)' })
  @ApiOkResponse({ type: PaginatedEventsResponseDto })
  async list(
    @Query() query: ListEventsDto,
  ): Promise<PaginatedEventsResponseDto> {
    const result = await this.eventsService.list(query);
    return PaginatedEventsResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por id' })
  @ApiOkResponse({ type: EventResponseDto })
  @ApiNotFoundResponse({ description: 'Evento no encontrado' })
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    return EventResponseDto.fromDomain(await this.eventsService.getById(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un evento' })
  @ApiOkResponse({ type: EventResponseDto })
  @ApiNotFoundResponse({ description: 'Evento no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    return EventResponseDto.fromDomain(await this.eventsService.update(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un evento' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Evento no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.eventsService.remove(id);
  }
}
