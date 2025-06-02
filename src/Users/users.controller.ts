import {Body, Controller, Get, Post, Param, Patch, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth('access-token') //Asi es como se llama en el main.ts
@UseGuards(JwtAuthGuard) //Si lo pongo aqui me protege todas las rutas, si solo quiero alguna lo tengo que poner solo en esa
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Alta de usuario
  @Post('alta')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  //Traemos todos los usuarios
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  //Buscar usuario por el id
  @Get('buscar/:id')
  findOne(@Param('id') id_users: number) {
    return this.usersService.findOne(id_users);
  }

  //Actualizamos la contraseña -- falta verificar si funciona
  @Patch('usuarios/:id/password_users')
  updatePassword(@Param('id') id_users: number, @Body('password_users') password_users:string ) {
    return this.usersService.updatePassword(id_users, password_users);
  }

  //Borramos un usuario filtrando por el id
  @Delete('eliminar/:id')
  delete(@Param('id') id_users: number) {
    return this.usersService.delete(id_users);
  }
}
