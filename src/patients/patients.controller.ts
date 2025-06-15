import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { FindPatientDto } from './dtos/find-patients.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los pacientes' })
  findAllPatients() {
    return this.patientsService.findAllPatients();
  }
}
