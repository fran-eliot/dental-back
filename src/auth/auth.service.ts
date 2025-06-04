import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  //Servicio del login, devuelve el token del usuario y su role
  async login(loginDto: LoginDto) {

    const { username_users, password_users } = loginDto;
    //Aqui no llega la password
    const userDto = await this.usersService.findByEmail(username_users);
    if (!userDto){
      throw new UnauthorizedException('El usuario no existe');
    }
    const userEntity = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password_users')
      .where('user.username_users = :username', { username: username_users })
      .getOne();
    
    if (!userEntity || !userEntity.password_users) {
      throw new UnauthorizedException('Usuario o contraseña incorrecta');
    }

    const isPasswordValid = await bcrypt.compare(password_users, userEntity.password_users);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    const payload = { username: userDto.username_users, sub: userDto.id_users, rol: userDto.rol_users };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userDto.id_users,
        email: userDto.username_users,
        rol: userDto.rol_users
      }
    };
  }
}
