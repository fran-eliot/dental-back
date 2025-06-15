import { Module } from '@nestjs/common';
import { Patient } from './entities/patients.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController ],
  providers: [PatientsService ],
  exports: []
})
export class PatientsModule {}
