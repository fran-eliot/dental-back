import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
//Para encryptar la contraseña en la base de datos
import * as bcrypt from 'bcrypt';
//Esto aqui para excluir la contraseña
import { instanceToPlain } from 'class-transformer';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>){}

  //Alta de nuevo usuario, si devuelve false es porque el mail esta duplicado y no deja crearlo
  async create(createUserDto: CreateUserDto): Promise <User> {

    const { username_users, password_users } = createUserDto;

    // Verifica si el email está vacío
    if (!username_users || username_users.trim() === '') {
      throw new BadRequestException('El email es obligatorio');
    }

    const resultEmailDuplicado = await this.usersRepository.findOneBy({username_users:createUserDto.username_users});
    if(resultEmailDuplicado){
      throw new BadRequestException('El usuario ya está registrado');
    }else{
      //Verifica que la constraseña no este vacia
      if (!password_users || password_users.trim() === '') {
        throw new BadRequestException('La contraseña no puede esta vacía');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password_users, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password_users: hashedPassword,
      })
      //Añade nuevo usuario y lo devuelve para que despues del registro podamos crear el professional
      const saveUser = await this.usersRepository.save(user);
      return saveUser;
    }
  }

  //Devuelve todos los usuarios sin las contraseñas
  async findAll(): Promise<any> {
  const users = await this.usersRepository.find();
  return instanceToPlain(users); //Elimina la contraseña de la respuesta
}

  //Devuelve el usuario por id sin la contraseña
  async findOne(id_users: number): Promise<any> {
  const user = await this.usersRepository.findOneBy({ id_users });
  return instanceToPlain(user); 
}

  //Buscamos el usuario por email , para el login
  async findByEmail(username_users: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username_users });
  }

  //Actualizamos solo la contraseña
  async updatePassword(id_users: number, newPassword: string): Promise<string>{
    const user = await this.usersRepository.findOne({ where: { id_users: id_users } });
    if(!user){
      throw new Error(`Usuario con ID ${id_users} no encontrado`);
    }else{
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password_users = hashedPassword;
    await this.usersRepository.save(user);
    return `Contraseña actualizada para el usuario con ID ${id_users}`;
    }
  }

  //Borramos el usuario filtrando por el id
  async delete(id_users: number): Promise<string> {
    const result = await this.usersRepository.delete(id_users);

    if (result.affected == 0) {
      throw new Error(`Usuario con ID ${id_users} no encontrado`);
    }
    return `Usuario con ID ${id_users} eliminado correctamente`;
  }
}
