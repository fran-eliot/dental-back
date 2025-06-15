import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patients.entity';
import { Repository } from 'typeorm';
import { FindPatientDto } from './dtos/find-patients.dto';

@Injectable()
export class PatientsService {
  constructor(
      @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    
    ){}

  //Traer todos los pacientes
  async findAllPatients(): Promise<FindPatientDto[]> {
    return (await this.patientRepository.find())
      .map(patient => new FindPatientDto(patient.name_patients,
        patient.last_name_patients,
        patient.phone_patients,
        patient.email_patients,
        patient.is_active_patients,
        patient.id_patients,
        patient.nif_patients ));
  }
}
