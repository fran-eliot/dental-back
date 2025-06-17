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
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FindAppointmentDto } from './dtos/find-appointment.dto';
import { AppointmentResponseDto } from './dtos/response-appointment.dto';
import { type } from 'os';
import { HistoryAppointmentDto } from './dtos/history-appointment.dto';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('nuevaReserva')
  @ApiOperation({ summary: 'Dar una nueva reserva' })
  @ApiBody({ type: CreateAppointmentDto })
  newAppointment(@Body () createAppointmentDto:CreateAppointmentDto):Promise<Appointment>{
    return this.appointmentsService.newAppointment(createAppointmentDto);
  }

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

  @Get('reservas-por-fechas')
  @ApiOperation({ summary: 'Buscar reservas por rango de fechas' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'professional_id', required: false, type: Number, description: 'ID del profesional' })
  async findAppointmentsByDates(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('professional_id') professional_id?: number,
  ): Promise<AppointmentResponseDto[]> {
    const filtersAppointments: { startDate: string; endDate: string; professional_id?: number } = {
      startDate,
      endDate,
    };

    if (professional_id) filtersAppointments.professional_id = Number(professional_id);
    return this.appointmentsService.findAppointmentsByDates(filtersAppointments);
  }

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
