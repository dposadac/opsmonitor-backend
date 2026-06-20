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
import { IncidentsService } from '../application/incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.open(dto);
  }

  @Get()
  list(@Query('status') status?: string) {
    return this.incidentsService.list(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.getById(id);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.incidentsService.resolve(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.incidentsService.remove(id);
  }
}
