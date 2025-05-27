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

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.username_users);
    if (!user || !(await bcrypt.compare(loginDto.password_users, user.password_users))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { username: user.username_users, sub: user.id_users };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
