import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { Professional } from './entities/profesional.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ResponseProfessionalDto } from './dto/response-professional.dto';
import { User } from 'src/users/entities/user.entity';
import { FindProfessionalDto } from './dto/find-professional.dto';

@Injectable()
export class ProfessionalsService {

  constructor(
    @InjectRepository(Professional) private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ){}

  //Crea nuevo dentista
  async newProfessional(createProfessionalDto: CreateProfessionalDto): Promise<CreateProfessionalDto> {
    try{
      const { user_id, ...rest } = createProfessionalDto;
      //buscamos el ultimo id_users guardado
      const user = await this.userRepository.findOne({
        where: { id_users: user_id },
      });
      if (!user) {
        throw new Error('No hay usuarios registrados para asociar al profesional.');
      }
      //creamos una instancia de Professional que copia todas las propiedades del DTO en ella(con los ...)
      const professional = this.professionalRepository.create({
        ...rest,
        user // como se llama la propiedad del user_id en la entidad Professional
        
      });
      const savedProfessional = await this.professionalRepository.save(professional);
      return {
        user_id: savedProfessional.user.id_users,
        nif_professionals: savedProfessional.nif_professionals,
        license_number_professionals: savedProfessional.license_number_professionals,
        name_professionals: savedProfessional.name_professionals,
        last_name_professionals: savedProfessional.last_name_professionals,
        phone_professionals: savedProfessional.phone_professionals,
        email_professionals: savedProfessional.email_professionals,
        assigned_room_professionals: savedProfessional.assigned_room_professionals,
        is_active_professionals: savedProfessional.is_active_professionals,
      };
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
  //Actualización datos del profesional
  async updateProfessional(updateProfessionalDto:UpdateProfessionalDto):Promise<UpdateProfessionalDto>{
    const professional = await this.professionalRepository.findOneBy({id_professionals:updateProfessionalDto.id_professionals});
    professional.phone_professionals = updateProfessionalDto.phone_professionals;
    professional.email_professionals = updateProfessionalDto.email_professionals;
    professional.is_active_professionals = updateProfessionalDto.is_active_professionals;
    return this.professionalRepository.save(professional);
    
  }

  //Traer todos los professionales
    async findAllProfessionals(): Promise<FindProfessionalDto[]> {
      return (await this.professionalRepository.find())
        .map(pro => new FindProfessionalDto(pro.id_professionals, pro.nif_professionals, pro.license_number_professionals, pro.name_professionals, pro.last_name_professionals,pro.phone_professionals, pro.email_professionals, pro.assigned_room_professionals, pro.is_active_professionals));
    }

}
