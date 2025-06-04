import { Module } from '@nestjs/common';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';
import { Professional } from './entities/profesional.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professional, User])],
  controllers: [ProfessionalsController, ],
  providers: [ProfessionalsService, ],
  exports: []
})
export class ProfessionalsModule {}
