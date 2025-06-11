import {Body, Controller, Get, Post, Param, Patch, Delete, UseGuards,BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Dar de alta un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.usersService.create(createUserDto);
  }

  //Traemos todos los usuarios
  @Get('')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  //Buscar usuario por el id, viene como string y hay que pasarlo a num
  @Get('buscar/:id')
  @ApiOperation({ summary: 'Obtener un usuario por su id' })
  @ApiParam({ name: 'id', type: Number })
  
  findOne(@Param('id') id_users: number) {
    const findUserDto = new FindUserDto(id_users);
    return this.usersService.findOne(findUserDto);

  }

  //Actualizamos la contraseña -- funciona con postman
  @Patch('/:id/update_password')
  @ApiOperation({ summary: 'Actualizamos la contraseña de un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  
  updatePassword(@Param('id') id_users: number, @Body('password_users') password_users:string ) {
    const updateUserDto = { id_users, password_users };
    return this.usersService.updatePassword(updateUserDto);
  }

  //Actualizamos el rol---funciona con postman
  @Patch('/:id/rol_users')
  @ApiOperation({ summary: 'Actualizamos el rol de un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({schema: {type: 'object', properties: {rol_users: {type: 'string', enum: ['admin', 'dentista'], example: 'admin'},}, required: ['rol_users'], },})
  
  async updateRol(@Param('id', ParseIntPipe) id_users: number, @Body() rol: {rol_users:UserRole} ) {
    const { rol_users } = rol;

    if (!Object.values(UserRole).includes(rol_users)) {
      throw new BadRequestException(`Rol inválido: ${rol_users}`);
    }
    await this.usersService.updateRol({ id_users, rol_users });
    return { message: `Rol actualizado para el usuario con ID ${id_users}` };

  }

  //Cambiamos de activo a inactivo y viceversa
  @Patch(':id/toggle_status')
  @ApiOperation({ summary: 'Actualiza el status de un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { type: 'object', properties: { is_active_users: { type: 'boolean', example:true, description: 'Indica si el usuario debe estar activo (true) o inactivo (false)' } }, required: ['is_active_users'] } })
  
  toggleStatus(@Param('id') id_users: number, @Body() body: { is_active_users: boolean }){
    return this.usersService.toggleUserStatus(id_users, body.is_active_users);
  }

  //Actualizamos el username en users y tb en professionals
  @Patch(':id/username')
  @ApiOperation({ summary: 'Actualiza el username' })
  @ApiBody({ schema: { type: 'object', properties: { username_users: { type: 'string' } } } })
  
  async updateUsername(@Param('id') id_users: number, @Body('username_users') username_users: string) {
    await this.usersService.updateUsername(id_users, username_users);
    return { message: 'Username actualizado correctamente' };
  }
}
