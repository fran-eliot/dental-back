import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { Treatment } from './entities/Treatment';
import { TreatmentsService } from './treatments.service';



@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post('alta')
  async createTreatment(@Body() treatment: Treatment,@Res() res: Response, ): Promise<Response> {

    const newTreatment = await this.treatmentsService.createTreatment(treatment);
    return res.status(201).json(newTreatment);
  }
  @Get('todos')
  async getAllTreatments( @Res() res: Response,){

    const treatments = await this.treatmentsService.getAll();
    return res.status(200).json(treatments);
  }
  
  
}
  



