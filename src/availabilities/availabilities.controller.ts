/**
 * Controlador de las disponibilidades de los profesionales.
 * Gestiona la creación, consulta, actualización y limpieza de slots de disponibilidad.
 */

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { ProfessionalAvailability } from './entities/ProfessionalAvailability';
import { Status } from './enums/status.enum';
import { Slot } from './entities/Slot';
import { UpdateAvailabilityStatusDto } from './dtos/UpdateAvailabilityStatusDto';
import { AvailabilityFilterDto } from './dtos/AvailabilityFilterDto';
import { CleanOldAvailabilitiesDto } from './dtos/CleanOldAvailabilitiesDto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateMonthlyAvailabilitiesDto } from './dtos/GenerateMonthlyAvailabilitiesDto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Disponibilidades')
@ApiBearerAuth('access-token')  //Esto es solo para swagger
@Controller('disponibilidades')
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  /**
   * Genera todas las disponibilidades para los profesionales activos
   * de lunes a viernes de esta semana en tramos de 30 minutos.
   * Ruta: POST /disponibilidades/genera-semana
   */
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Post('genera-semana')
  @ApiOperation({ summary: 'Generar disponibilidades para esta semana' })
  @ApiResponse({ status: 201, description: 'Disponibilidades generadas correctamente' })
  async generateThisWeek() {
    await this.availabilitiesService.generateAvailabilitiesForNextWeek();
    return { message: 'Disponibilidades generadas para esta semana' };
  }

  /**
  * Genera disponibilidades para todos los profesionales activos durante
  * el mes indicado (de lunes a viernes, en tramos de 30 minutos).
  * Si ya existen disponibilidades para ese mes, se lanza un error.
  * Ruta: POST /disponibilidades/genera-mes
  */
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Post('genera-mes')
  @ApiOperation({ summary: 'Generar disponibilidades para un mes específico' })
  @ApiResponse({ status: 201, description: 'Disponibilidades generadas correctamente para el mes especificado' })
  @ApiResponse({ status: 409, description: 'Ya existen disponibilidades para el mes especificado' })
  async generateMonthlyAvailabilities(
      @Body() dto: GenerateMonthlyAvailabilitiesDto,) {
      return this.availabilitiesService.generateMonthlyAvailabilities(dto);
  }
  

  /**
   * Devuelve las disponibilidades de un profesional para una fecha concreta.
   * Ruta: GET /disponibilidades/:id/:date
   * @param dto Contiene professionalId y date
   */
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin','dentista') //para que roles esta permitido
  @Get(':professionalId/:date')
  @ApiOperation({ summary: 'Obtener disponibilidades de un profesional para una fecha concreta' })
  @ApiParam({ name: 'professionalId', type: Number, description: 'ID del profesional' })
  @ApiParam({ name: 'date', type: String, description: 'Fecha en formato YYYY-MM-DD' })
  @ApiResponse({
    status: 200,
    description: 'Lista de disponibilidades',
    type: ProfessionalAvailability,
    isArray: true
    })
  async getAvailabilities(@Param() dto: AvailabilityFilterDto): Promise<ProfessionalAvailability[]>{
    console.log('llega');
    const date = new Date(dto.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }
    return this.availabilitiesService.getAvailabilityByProfessional(dto.professionalId, date);
  }

  /**
   * Actualiza el estado de una disponibilidad concreta (libre, reservado o no disponible).
   * Ruta: PATCH /disponibilidades/:id
   * @param id ID de la disponibilidad
   * @param updateDto Estado nuevo (libre, reservado o no disponible)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin','dentista') //para que roles esta permitido
  @Patch(':id/')
  @ApiOperation({ summary: 'Actualizar estado de una disponibilidad' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la disponibilidad' })
  @ApiBody({ type: UpdateAvailabilityStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad actualizada',
    type: ProfessionalAvailability
  })
  updateStatus(@Param('id', ParseIntPipe) id:number,@Body() updateDto:UpdateAvailabilityStatusDto):Promise<ProfessionalAvailability>{
    return this.availabilitiesService.updateAvailabilityStatus(id, updateDto.status);
  }

  /**
   * Devuelve los slots libres de un profesional en una fecha concreta.
   * Ruta: GET /disponibilidades/slots-libres/:professionalId/:date
   * @param dto Contiene professionalId y date
   */
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Get('slots-libres/:professionalId/:date')
  @ApiOperation({ summary: 'Obtener slots libres de un profesional en una fecha concreta' })
  @ApiParam({ name: 'professionalId', type: Number, description: 'ID del profesional' })
  @ApiParam({ name: 'date', type: String, description: 'Fecha en formato YYYY-MM-DD' })
  @ApiResponse({
    status: 200,
    description: 'Slots libres',
    type: Slot,
    isArray: true
  })
  getFreeSlots(@Param() dto: AvailabilityFilterDto): Promise<Slot[]> {
    return this.availabilitiesService.getFreeSlotsByDate(dto.professionalId, new Date(dto.date));
  }

  /**
   * Elimina todas las disponibilidades anteriores a una fecha concreta.
   * Ruta: DELETE /disponibilidades/limpieza/:beforeDate
   * @param dto Contiene beforeDate como string (YYYY-MM-DD)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Delete('limpieza/:beforeDate')
  @ApiOperation({ summary: 'Eliminar disponibilidades anteriores a una fecha' })
  @ApiParam({ name: 'beforeDate', type: String, description: 'Fecha límite en formato YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Disponibilidades antiguas eliminadas' })
  async cleanOld(@Param() dto:CleanOldAvailabilitiesDto): Promise<{ message: string }> {
    const date = new Date(dto.beforeDate);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }
    await this.availabilitiesService.cleanOldAvailabilities(date);
    return { message: 'Disponibilidades antiguas eliminadas correctamente' };
  }


}
