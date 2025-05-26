import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
//Para encryptar la contraseña en la base de datos
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>){}

  async create(createUserDto: CreateUserDto): Promise <boolean> {
    const resultEmailDuplicado = await this.usersRepository.findOneBy({username_users:createUserDto.username_users});
    if(resultEmailDuplicado){
      return false;
    }else{
      const hashedPassword = await bcrypt.hash(createUserDto.password_users, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password_users: hashedPassword,
      })
      //'Añade nuevo usuario';
      this.usersRepository.save(user);
      return true;
    }
  }

  findAll(): Promise<User[]> {
    //`Devuelve todos los users`;
    return this.usersRepository.find();
  }

  findOne(id_users: number): Promise<User> {
    //`Devuelve el usuario por id`;
    return this.usersRepository.findOneBy({id_users: id_users});
  }

  async updatePassword(id_users: number, newPassword: string): Promise<string>{
    //`Actualizamos la contraseña`;
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

  async delete(id_users: number): Promise<string> {
    //borramos el contacto por id
    const result = await this.usersRepository.delete(id_users);

    if (result.affected == 0) {
      throw new Error(`Usuario con ID ${id_users} no encontrado`);
    }
    return `Usuario con ID ${id_users} eliminado correctamente`;
  }

  async findByEmail(username_users: string): Promise<User | null> {
    //Encontramos el usuario por email
    return this.usersRepository.findOneBy({ username_users });
  }

}
