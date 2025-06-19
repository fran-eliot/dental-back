import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { FindOneAndDeleteOptions, ILike, Repository } from 'typeorm';
import { FindPatientDto } from './dtos/find-patient.dto';
import { PaginatedPatientsDto } from './dtos/paginated-patients.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { CreatePatientDto } from './dtos/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
      @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
  ){}

  //Traer todos los pacientes
  async searchPatients(term: string): Promise<FindPatientDto[]> {
    const patients = await this.patientRepository.find({
      where: [
        { name_patients: ILike(`%${term}%`) },
        { last_name_patients: ILike(`%${term}%`) },
        { email_patients: ILike(`%${term}%`) },
      ],
      order: { last_name_patients: 'ASC' },
    });

    return patients.map(
      (p) =>
        new FindPatientDto(
          p.name_patients,
          p.last_name_patients,
          p.phone_patients,
          p.email_patients,
          p.is_active_patients,
          p.id_patients,
          p.nif_patients
        )
    );
  }
  //buscar todos los pacientes
  async findAllPatients(): Promise<FindPatientDto[]> {
    const patients = await this.patientRepository.find({
      order: { last_name_patients: 'ASC' }, // opcional, para ordenar por apellido
    });

    return patients.map(patient => new FindPatientDto(
      patient.name_patients,
      patient.last_name_patients,
      patient.phone_patients,
      patient.email_patients,
      patient.is_active_patients,
      patient.id_patients,
      patient.nif_patients,
    ));
  }
  //Encontrar Paciente por id
  async findPatientById(id: number): Promise<FindPatientDto> {
  const patient = await this.patientRepository.findOne({ where: { id_patients: id } });

  if (!patient) {
    throw new NotFoundException(`No se encontró el paciente con ID ${id}`);
  }

  return patient;
}
  //actualizar un paciente
  async updatePatient(id: number, updatePatientDto: UpdatePatientDto): Promise<UpdatePatientDto> {
    const patient = await this.findPatientById(id);

    const { nif_patients, phone_patients, email_patients } = updatePatientDto;

    const existing = await this.patientRepository.findOne({
      where: [
        { nif_patients },
        { phone_patients },
        { email_patients },
      ],
    });

    if (existing && existing.id_patients !== id) {
      throw new BadRequestException('Ya existe un paciente con el mismo NIF, teléfono o email.');
    }

    const updated = Object.assign(patient, updatePatientDto);
    return await this.patientRepository.save(updated);
  }

  //Crear paciente
  async createPatient(createPatientDto: CreatePatientDto): Promise<CreatePatientDto> {
      const { nif_patients, phone_patients, email_patients } = createPatientDto;

    const existing = await this.patientRepository.findOne({
      where: [
        { nif_patients },
        { phone_patients },
        { email_patients },
      ],
    });

    if (existing) {
      throw new BadRequestException('Ya existe un paciente con el mismo NIF, teléfono o email.');
    }

    const patient = this.patientRepository.create(createPatientDto);
    return await this.patientRepository.save(patient);
  }

}
