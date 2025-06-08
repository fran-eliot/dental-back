import { ProfessionalsModule } from './../professional/professionals.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AvailabilitiesController } from "./availabilities.controller";
import { AvailabilitiesService } from "./availabilities.service";
import { Module } from "@nestjs/common";
import { ProfessionalAvailability } from "./entities/ProfessionalAvailability";
import { Slot } from "./entities/Slot";
import { Professional } from "src/professional/entities/profesional.entity";



@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalAvailability, Slot, Professional]), ProfessionalsModule],
  controllers: [AvailabilitiesController, ],
  providers: [AvailabilitiesService,],
  exports: []
})
export class AvailabiltiesModule {}