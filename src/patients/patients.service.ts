import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { FindPatientDto } from './dtos/find-patient.dto';
import { CreatePatientDto } from './dtos/create-Patient.dto';

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
  //crear un paciente
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const newPatient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(newPatient);
  }
  
  //actualizar un paciente
  async update(id: number, updatePatientDto: CreatePatientDto): Promise<Patient> {
    await this.patientRepository.update(id, updatePatientDto);
    return this.patientRepository.findOneBy({ id_patients: id });
  }


}
