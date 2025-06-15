import { Module } from '@nestjs/common';
import { Treatment } from './entities/treatment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentsController } from './treatments.controller';
import { TreatmentsService } from './treatments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Treatment])],
  controllers: [TreatmentsController ],
  providers: [TreatmentsService ],
  exports: []
})
export class TreatmentsModule {}
