import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AvailabilitiesService } from '../service/availabilities.service';


@Controller('availabilitiess')
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Post('generate-week')
  async generateThisWeek() {
    await this.availabilitiesService.generateAvailabilitiesForNextWeek();
    return { message: 'Disponibilidades generadas para esta semana' };
  }
}
