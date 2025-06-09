//Vamos a utilizar validaciones automáticas con el class-validator
import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsNumber, IsOptional, IsInt, Matches, Length } from 'class-validator';

export class CreateProfessionalDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  @Length(9, 9, { message: 'El NIF debe tener exactamente 9 caracteres' })
  @Matches(/^[0-9]{8}[A-Z]$/, {
    message: 'El NIF debe tener 8 números y terminar con una letra mayúscula (ej: 12345678Z)',
  })
  nif_professionals: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^DENT-\d{4}$/, {
    message: 'La licencia debe tener el formato "DENT-****"',
  })
  license_number_professionals: string;

  @IsNotEmpty()
  @IsString()
  name_professionals: string;

  @IsNotEmpty()
  @IsString()
  last_name_professionals: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[6789]\d{8}$/, {
    message: 'El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9',
  })
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


