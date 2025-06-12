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
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FindAppointmentDto } from './dtos/find-appointment.dto';
import { AppointmentResponseDto } from './dtos/response-appointment.dto';
import { type } from 'os';

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

  if (!date_appointments || !professional_id) {
    throw new BadRequestException('Se requieren los parámetros professional_id y date_appointments');
  }
  
  const filtersAppointments: { professional_id?: number; date_appointments?: string } = {};

  if (professional_id) filtersAppointments.professional_id = Number(professional_id);
  if (date_appointments) filtersAppointments.date_appointments = date_appointments;

  return this.appointmentsService.findAppointments(filtersAppointments);
}
  
}
