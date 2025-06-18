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
import { FindPatientDto } from './dtos/find-patient.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dtos/create-Patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los pacientes' })
  findAllPatients() {
    return this.patientsService.findAllPatients();
  }
  @Post('create')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }
  
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(Number(id), updatePatientDto); 
  }
}