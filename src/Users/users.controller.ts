import {Body, Controller, Get, Post, Param, Patch, Delete, UseGuards,BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/rol.enum';

@ApiTags('users')
@ApiBearerAuth('access-token') //Asi es como se llama en el main.ts
@UseGuards(JwtAuthGuard) //Si lo pongo aqui me protege todas las rutas, si solo quiero alguna lo tengo que poner solo en esa
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Alta de usuario
  @Post('alta')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  //Traemos todos los usuarios
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  //Buscar usuario por el id, viene como string y hay que pasarlo a num
  @Get('buscar/:id')
  findOne(@Param('id') id_users: number) {
    const findUserDto = new FindUserDto(id_users);
    return this.usersService.findOne(findUserDto);

  }

  //Actualizamos la contraseña -- funciona con postman
  @Patch('/:id/password_users')
  updatePassword(@Param('id') id_users: number, @Body('password_users') password_users:string ) {
    const updateUserDto = { id_users, password_users };
    return this.usersService.updatePassword(updateUserDto);
  }

  //Actualizamos el rol---funciona con postman
  @Patch('/:id/rol_users')
  updateRol(@Param('id') id_users: number, @Body() rol:UpdateUserDto ) {
    const { rol_users } = rol;

    if (!Object.values(UserRole).includes(rol_users as UserRole)) {
      throw new BadRequestException(`Rol inválido: ${rol_users}`);
    }
    const updateUserDto = { id_users, rol_users};
    return this.usersService.updateRol(updateUserDto);
  }

  //Cambiamos de activo a inactivo y viceversa
  @Patch(':id/toggle_status')
  toggleStatus(@Param('id') id_users: number) {
    return this.usersService.toggleUserStatus(id_users);
  }

  /*Borramos un usuario filtrando por el id
  @Delete('eliminar/:id')
  delete(@Param('id') id_users: number) {
    return this.usersService.delete(id_users);
  }*/
}
