import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Treatment } from './entities/treatment.entity';
import { FindTreatmentDto } from './dtos/find-treatment.dto';
import { CreateTreatmentDto } from './dtos/create-treatment.dto';

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectRepository(Treatment) private readonly treatmentRepository: Repository<Treatment>,
  ) {}

  // Traer todos los tratamientos
  async findAllTreatments(): Promise<FindTreatmentDto[]> {
    const treatments = await this.treatmentRepository.find();

    return treatments.map(treatment => new FindTreatmentDto(
      treatment.id_treatments,
      treatment.name_treatments,
      treatment.type_treatments,
      treatment.duration_minutes_treatments,
      treatment.price_treatments,
      treatment.visible_to_patients_treatments,
      treatment.is_active_treatments
    ));
  }
  //Crear nuevo tratamiento
  async createTreatment(createTreatmentDto: CreateTreatmentDto): Promise<Treatment> {
    const newTreatment = this.treatmentRepository.create(createTreatmentDto);
    return await this.treatmentRepository.save(newTreatment);
  }
}
