import { CreateTreatmentDto } from './dtos/create-treatment.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';

import { TreatmentsService } from './treatments.service';
import { ApiOperation } from '@nestjs/swagger';
import { Treatment } from './entities/treatment.entity';
import { Response } from 'express';

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los pacientes' })
  findAllTreatments() {
    return this.treatmentsService.findAllTreatments();
  }

  @Post('alta')
  @ApiOperation({ summary: 'Crea el nuevo tratamiento'})
  async createTreatment(@Body() treatmentDto: CreateTreatmentDto, @Res() res: Response, ): Promise<Response> {
    const newTreatment = await this.treatmentsService.createTreatment(treatmentDto);
    return res.status(201).json(newTreatment);
  }
}
