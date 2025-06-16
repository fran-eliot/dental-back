import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { FindPatientDto } from './dtos/find-patient.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('patients')
@ApiBearerAuth('access-token') //Esto es solo para swagger
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin', 'dentista') //para que roles esta permitido
  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los pacientes' })
  findAllPatients() {
    return this.patientsService.findAllPatients();
  }
}
