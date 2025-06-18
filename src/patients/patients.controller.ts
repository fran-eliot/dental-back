import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { FindPatientDto } from './dtos/find-patient.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { CreatePatientDto } from './dtos/create-patient.dto';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentista')
  @Get('search/:term')
  @ApiOperation({ summary: 'Buscar pacientes por nombre, apellido o email' })
  searchPatients(@Param('term') term: string) {
    return this.patientsService.searchPatients(term);
  }

  // Actualizar paciente
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentista')
  @Put('update/:id')
  @ApiOperation({ summary: 'Actualizamos un paciente existente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.updatePatient(id, updatePatientDto);
  }

  // crear paciente
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Solo admin puede crear
  @Post('alta')
  @ApiOperation({ summary: 'Creamos un nuevo paciente' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.createPatient(createPatientDto);
  }

}
