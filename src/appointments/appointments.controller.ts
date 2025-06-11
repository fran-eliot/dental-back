import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('nuevaReserva')
  @ApiOperation({ summary: 'Dar una nueva reserva' })
  @ApiBody({ type: CreateAppointmentDto })
  newAppointment(@Body () createAppointmentDto:CreateAppointmentDto):Promise<Appointment>{
    return this.appointmentsService.newAppointment(createAppointmentDto);
  }
}
