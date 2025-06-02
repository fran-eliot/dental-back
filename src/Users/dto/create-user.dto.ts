
import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from "../enums/rol.enum";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  username_users: string;

  @IsNotEmpty()
  //@IsStrongPassword() para mas adelante
  @IsString()
  password_users: string;

  @IsNotEmpty()
  @IsString()
  rol_users: UserRole;

  @IsBoolean()
  is_active_users?: boolean; // Opcional
}
