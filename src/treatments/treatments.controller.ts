import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TreatmentsService } from './treatments.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los pacientes' })
  findAllTreatments() {
    return this.treatmentsService.findAllTreatments();
  }
}
