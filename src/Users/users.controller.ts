import {Body, Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('nuevo_usuario')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_users: number) {
    return this.usersService.findOne(id_users);
  }

  @Patch(':id/password_users')
  //http://localhost:3000/users/1/password_users paso un json con la password_users:"nueva_contraseña";
  updatePassword(@Param('id') id_users: number, @Body('password_users') password_users:string ) {
    return this.usersService.updatePassword(id_users, password_users);
  }

  @Delete(':id')
  delete(@Param('id') id_users: number) {
    return this.usersService.delete(id_users);
  }
}
