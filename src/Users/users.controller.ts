import {Body, Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
//import { UseGuards } from '@nestjs/common';
//import { JwtAuthGuard } from 'src/auth/jwt.guard';
//import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

//Swagger mostrará un botón "Authorize" que me permite ingresar un token JWT para autenticarte y probar las rutas protegidas.
/*@ApiTags('users')
@ApiBearerAuth('access-token')
//De momento no voy a implementar esto para que no me pida la autorizacion
@UseGuards(JwtAuthGuard)*/
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

  @Patch(':id/:password_users')
  updatePassword(@Param('id') id_users: number, @Param('password_users') password_users:string ) {
    return this.usersService.updatePassword(id_users, password_users);
  }

  @Delete(':id')
  delete(@Param('id') id_users: number) {
    return this.usersService.delete(id_users);
  }
}
