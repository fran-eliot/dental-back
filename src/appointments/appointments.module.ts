import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Slot } from 'src/availabilities/entities/Slot';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Slot])
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: []
})
export class AppointmentsModule {}
