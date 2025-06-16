import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FindAppointmentDto } from './dtos/find-appointment.dto';
import { AppointmentResponseDto } from './dtos/response-appointment.dto';
import { type } from 'os';
import { HistoryAppointmentDto } from './dtos/history-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('appointments')
@ApiBearerAuth('access-token') //Esto es solo para swagger
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Post('nuevaReserva')
  @ApiOperation({ summary: 'Dar una nueva reserva' })
  @ApiBody({ type: CreateAppointmentDto })
  newAppointment(@Body () createAppointmentDto:CreateAppointmentDto):Promise<Appointment>{
    return this.appointmentsService.newAppointment(createAppointmentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin', 'dentista') //para que roles esta permitido
  @Get('reservas')
  @ApiResponse({ status: 200, description: 'Listado de reservas', type: [AppointmentResponseDto]})
  @ApiQuery({ name: 'professional_id', required: false, type: Number, description: 'ID del profesional' })
  @ApiQuery({ name: 'date_appointments', required: false, type: String, description: 'Fecha de la cita (YYYY-MM-DD)' })
  async findAppointments(
  @Query('professional_id') professional_id?: number, @Query('date_appointments') date_appointments?: string,): Promise<AppointmentResponseDto[]> {
    const filtersAppointments: { professional_id?: number; date_appointments?: string } = {};

    if (professional_id) filtersAppointments.professional_id = Number(professional_id);
    if (date_appointments) filtersAppointments.date_appointments = date_appointments;
    return this.appointmentsService.findAppointments(filtersAppointments);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin', 'dentista') //para que roles esta permitido
  @Get('history/:patientId')
  @ApiOperation({ summary: 'Obtener historial de citas de un paciente' })
  @ApiParam({ name: 'patientId', type: Number, description: 'ID del paciente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de citas históricas del paciente',
    type: [HistoryAppointmentDto],
  })
  async getHistoryByPatient(@Param('patientId') patientId: number): Promise<HistoryAppointmentDto[]> {
    return this.appointmentsService.findAppointmentsByPatient(patientId);
  }
}
