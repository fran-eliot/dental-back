import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { Professional } from './entities/profesional.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfessionalsService {

  constructor(@InjectRepository(Professional) private readonly professionalRepository: Repository<Professional>){}

  //Crea nuevo dentista
  async newProfessional(createProfessionalDto: CreateProfessionalDto): Promise<Professional> {
    try{
      //creamos una instancia de Professional que copia todas las propiedades del DTO en ella(con los ...)
      const professional = this.professionalRepository.create({
        ...createProfessionalDto,
        //el campo user en la entidad Professional es un objeto User, no un simple número, por eso le asignamos el id
        user: { id_users: createProfessionalDto.user_id }, // id_users tiene que coincidir como se llama en la entidad User
      });
      return await this.professionalRepository.save(professional);
    }catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nif_professionals')) {
          throw new BadRequestException('El NIF ya está registrado.');
        } else if (error.message.includes('license_number_professionals')) {
          throw new BadRequestException('El número de licencia ya está registrado.');
        } else {
          throw new BadRequestException('Ya existe un profesional con datos duplicados.');
        }
      }
      // Lanza el resto de errores tal cual
      throw error;
    }
    
  }

}
