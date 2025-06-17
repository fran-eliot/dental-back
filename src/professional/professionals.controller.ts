import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post('alta')
  @ApiOperation({ summary: 'Dar de alta un nuevo professional' })
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.newProfessional(createProfessionalDto);
  }

  @Put('actualizacion/:id_professionals')
  @ApiOperation({ summary: 'Actualización de un profesional' })
  updateProfessional(@Param("id_professionals") id_professionals: number , @Body() updateProfessionalDto: UpdateProfessionalDto){
    return this.professionalsService.updateProfessional(updateProfessionalDto);
  }

  //Traemos todos los usuarios
  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los profesionales' })
  findAllProfessionals() {
    return this.professionalsService.findAllProfessionals();
  }

  @Get('por-user/:userId')
  @ApiOperation({ summary: 'Obtenemos un profesional por userId' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.professionalsService.findProfessionalByUserId(userId);
  }

}
