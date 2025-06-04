//Vamos a utilizar validaciones automáticas con el class-validator
import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateProfessionalDto {
  @IsNumber()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  nif_professionals: string;

  @IsNotEmpty()
  @IsString()
  license_number_professionals: string;

  @IsNotEmpty()
  @IsString()
  name_professionals: string;

  @IsNotEmpty()
  @IsString()
  last_name_professionals: string;

  @IsNotEmpty()
  @IsString()
  phone_professionals: string;

  @IsNotEmpty()
  @IsEmail()
  email_professionals: string;

  @IsOptional()
  @IsString()
  assigned_room_professionals: string;

  @IsBoolean()
  is_active_professionals: boolean;
}


