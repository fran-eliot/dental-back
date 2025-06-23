import { CreateTreatmentDto } from './dtos/create-treatment.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';

import { TreatmentsService } from './treatments.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Treatment } from './entities/treatment.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateTreatmentDto } from './dtos/update-treatment.dto';

@ApiTags('treatments')
@ApiBearerAuth('access-token') //Esto es solo para swagger
@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los tratamientos' })
  findAllTreatments() {
    return this.treatmentsService.findAllTreatments();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Post('alta')
  @ApiOperation({ summary: 'Crea el nuevo tratamiento'})
  async createTreatment(@Body() treatmentDto: CreateTreatmentDto, @Res() res: Response, ): Promise<Response> {
    const newTreatment = await this.treatmentsService.createTreatment(treatmentDto);
    return res.status(201).json(newTreatment);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Protege con JWT y roles
  @Roles('admin') // Solo accesible por rol admin
  @Put('actualizar-tratamiento:id')
  @ApiOperation({ summary: 'Actualiza un tratamiento por su ID' })
  async updateTreatment(
    @Param('id') id: number,
    @Body() treatmentDto: UpdateTreatmentDto,
    @Res() res: Response,
  ): Promise<Response> {
    const updatedTreatment = await this.treatmentsService.update(id, treatmentDto);
    return res.status(200).json(updatedTreatment);
  }

}
