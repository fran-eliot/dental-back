import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FindProfessionalDto } from './dto/find-professional.dto';

@ApiTags('professionals')
@ApiBearerAuth('access-token') //Esto es solo para swagger
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Post('alta')
  @ApiOperation({ summary: 'Dar de alta un nuevo professional' })
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.newProfessional(createProfessionalDto);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin') //para que roles esta permitido
  @Put('actualizacion/:id_professionals')
  @ApiOperation({ summary: 'Actualización de un profesional' })
  updateProfessional(@Param("id_professionals") id_professionals: number , @Body() updateProfessionalDto: UpdateProfessionalDto){
    return this.professionalsService.updateProfessional(updateProfessionalDto);
  }

  //Traemos todos los usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin', 'dentista') //para que roles esta permitido
  @Get('all')
  @ApiOperation({ summary: 'Obtenemos todos los profesionales' })
  findAllProfessionals() {
    return this.professionalsService.findAllProfessionals();
  }

  //Traemos los profesionales activos
  @UseGuards(JwtAuthGuard, RolesGuard)//para proteger rutas
  @Roles('admin', 'dentista') //para que roles esta permitido
  @ApiOperation({ summary: 'Obtenemos los profesionales activos' })
  @Get('activos')
  async getActiveProfessionals(): Promise<FindProfessionalDto[]> {
    return this.professionalsService.findActiveProfessionals();
  }

  @Get('por-user/:userId')
  @ApiOperation({ summary: 'Obtenemos un profesional por userId' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.professionalsService.findProfessionalByUserId(userId);
  }

}
