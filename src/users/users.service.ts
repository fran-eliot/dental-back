import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
//Para encryptar la contraseña en la base de datos
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { Professional } from 'src/professional/entities/profesional.entity';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Professional) private readonly professionalsRepository: Repository<Professional>
  ){}

  //Alta de nuevo usuario, si devuelve false es porque el mail esta duplicado y no deja crearlo
  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {

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
  async findAll(): Promise<FindUserDto[]> {
    return (await this.usersRepository.find())
      .map(user => new FindUserDto(user.id_users, user.username_users, user.rol_users, user.is_active_users));
  }

  //Devuelve el usuario por id sin la contraseña
  async findOne(findUserDto: FindUserDto): Promise<FindUserDto> {
    const user = await this.usersRepository.findOneBy({id_users:findUserDto.id_users});
    return new FindUserDto(user.id_users, user.username_users, user.rol_users, user.is_active_users)

  }

  //Buscamos el usuario por email , se usa para el login
  async findByEmail(username_users: string): Promise<FindUserDto | null> {
    const user = await this.usersRepository
    .createQueryBuilder('user')
    .addSelect('user.password_users')  // cargar contraseña para comparar
    .where('user.username_users = :username', { username: username_users })
    .getOne();

    if (!user) return null;

    // Aquí creamos la instancia del DTO (sin password_users)
    return plainToInstance(FindUserDto, {
      id_users: user.id_users,
      username_users: user.username_users,
      rol_users: user.rol_users,
      is_active_users: user.is_active_users,
    });
  }

  //Actualizamos solo la contraseña
  async updatePassword(updateUserDto:UpdateUserDto): Promise<{message: string}>{
    const { id_users, password_users } = updateUserDto;
    if (!password_users) {
      throw new BadRequestException('La contraseña es requerida');
    }

    const user = await this.usersRepository.findOne({ where: {id_users} });
    if(!user){
      throw new Error(`Usuario con ID ${updateUserDto.id_users} no encontrado`);
    }else{
      const hashedPassword = await bcrypt.hash(password_users, 10);
      user.password_users = hashedPassword;
      await this.usersRepository.save(user);
      return { message: `Contraseña actualizada para el usuario con ID ${id_users}` };
    }
  }

  //Actualizamos el rol
  async updateRol(updateUserDto:UpdateUserDto): Promise<string>{
    const { id_users, rol_users } = updateUserDto;
    if (!rol_users) {
      throw new BadRequestException('El rol es requerido');
    }

    const user = await this.usersRepository.findOne({ where: {id_users} });
    if(!user){
      throw new Error(`Usuario con ID ${id_users} no encontrado`);
    }
    user.rol_users = rol_users; 
    await this.usersRepository.save(user);
    return `Rol actualizado para el usuario con ID ${id_users}`;
    
  }

  //Cambiamos de activo a inactivo y viceversa
  async toggleUserStatus(id_users: number, newStatus: boolean): Promise<UpdateUserDto> {
    const user = await this.usersRepository.findOne({ where: { id_users } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id_users} no encontrado`);
    }
    //me pone el contrario del que está
    user.is_active_users = newStatus;
    return await this.usersRepository.save(user);
    //return `Usuario con ID ${id_users} ahora está ${user.is_active_users ? 'activo' : 'inactivo'}`;
  }

  //Actualizamos el email tanto en usuarios como en la tabla professionals
  async updateUsername(id_users: number, newEmail: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id_users: id_users },
      relations: ['professional'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.username_users = newEmail;

    // Sincronizar con el profesional si existe
    if (user.professional) {
      user.professional.email_professionals = newEmail;
      await this.professionalsRepository.save(user.professional);
    }

    return user;
  }


  /*Borramos el usuario filtrando por el id
  async delete(id_users: number): Promise<string> {
    const result = await this.usersRepository.delete(id_users);

    if (result.affected == 0) {
      throw new Error(`Usuario con ID ${id_users} no encontrado`);
    }
    return `Usuario con ID ${id_users} eliminado correctamente`;
  }*/
}
