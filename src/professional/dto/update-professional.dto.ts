//Vamos a utilizar validaciones automáticas con el class-validator
import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsNumber, IsInt, IsOptional } from 'class-validator';

export class UpdateProfessionalDto {
  @IsNumber()
  @IsInt()
  @IsOptional()
  id_professionals: number;

  @IsNotEmpty()
  @IsString()
  phone_professionals: string;

  @IsNotEmpty()
  @IsEmail()
  email_professionals: string;

  @IsBoolean()
  is_active_professionals: boolean;
}