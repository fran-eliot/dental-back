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
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

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
  async findAppointments(@Query() filters: FindAppointmentDto): Promise<{
    data: AppointmentResponseDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    if (filters.professional_id) filters.professional_id = Number(filters.professional_id);
    if (filters.page) filters.page = Number(filters.page);
    if (filters.pageSize) filters.pageSize = Number(filters.pageSize);

    return this.appointmentsService.findAppointments(filters);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentista')
  @Patch('actualizar-estado/:id_reserva')
  @ApiOperation({ summary: 'Actualizar el estado de una reserva por ID' })
  @ApiParam({ name: 'id_reserva', type: Number, description: 'ID de la reserva' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Reserva actualizada correctamente', type: Appointment })
  async updateStatus(
    @Param('id_reserva') id_appointments: number,
    @Body() updateDto: UpdateAppointmentDto
  ): Promise<Appointment> {
    return this.appointmentsService.updateAppointmentStatus(id_appointments, updateDto);
  }

}
