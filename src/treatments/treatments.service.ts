import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Treatment } from './entities/Treatment';
import { Repository } from 'typeorm';


@Injectable()
export class TreatmentsService {
  

  constructor(@InjectRepository(Treatment) private readonly treatmentsRepository: Repository<Treatment>){}

    save(newtreatments:Treatment): void{
      this.treatmentsRepository.save(newtreatments)
    }
  
    // Obtener todos los tratamientos
     async getAll(): Promise<Treatment[]> {
      // Aquí se debe inyectar el repositorio de tratamientos
       return await this.treatmentsRepository.find();
      
    }
  
    async createTreatment(treatment: Treatment): Promise<Treatment> {
      const newTreatment = this.treatmentsRepository.create(treatment);
      return await this.treatmentsRepository.save(newTreatment);
    }
 
  }

  

