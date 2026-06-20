import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AlertsService } from '../application/alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.alertsService.dispatch(dto);
  }

  @Get()
  list() {
    return this.alertsService.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.getById(id);
  }

  @Patch(':id/acknowledge')
  acknowledge(@Param('id') id: string) {
    return this.alertsService.acknowledge(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.alertsService.remove(id);
  }
}
