import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post('alta')
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.newProfessional(createProfessionalDto);
  }

  @Put('actualizacion/:id_professionals')
  updateProfessional(@Param("id_professionals") id_professionals: number , @Body() updateProfessionalDto: UpdateProfessionalDto){
    return this.professionalsService.updateProfessional(updateProfessionalDto);
  }

  //Traemos todos los usuarios
  @Get('all')
  findAllProfessionals() {
    return this.professionalsService.findAllProfessionals();
  }

}
