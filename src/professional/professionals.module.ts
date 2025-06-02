import { Module } from '@nestjs/common';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';
import { Professional } from './entities/profesional.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Professional])],
  controllers: [ProfessionalsController, ],
  providers: [ProfessionalsService, ],
  exports: []
})
export class ProfessionalsModule {}
