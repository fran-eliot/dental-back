import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //Servicio del login
  async login(loginDto: LoginDto) {
    const { username_users, password_users } = loginDto;
    const user = await this.usersService.findByEmail(username_users);
    if (!user){
      throw new UnauthorizedException('El usuario no existe');
    }
    const isPasswordValid = await bcrypt.compare(password_users, user.password_users);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    const payload = { username: user.username_users, sub: user.id_users };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
