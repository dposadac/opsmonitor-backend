import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from '../application/events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventDto } from './dto/query-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.record(dto);
  }

  @Get()
  search(@Query() query: QueryEventDto) {
    return this.eventsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.getById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);
  }
}
