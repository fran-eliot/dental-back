import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { Professional } from './entities/profesional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post('alta')
  //Lanza un error si algún campo obligatorio está vacío o mal formado
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.newProfessional(createProfessionalDto);
  }

}
