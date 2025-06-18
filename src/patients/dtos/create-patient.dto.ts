import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreatePatientDto {

    @IsOptional()
    @IsString()
    @Length(9, 9, { message: 'El NIF debe tener exactamente 9 caracteres' })
    @Matches(/^[0-9]{8}[A-Z]$/, {
        message: 'El NIF debe tener 8 números y terminar con una letra mayúscula (ej: 12345678Z)',
    })
    nif_patients?: string;
    
    @IsString()
    name_patients: string;
    
    @IsString()
    last_name_patients: string;

    @IsOptional()
    @IsString()
    @Matches(/^[6789]\d{8}$/, {
        message: 'El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9',
    })
    phone_patients?: string;
    
    @IsOptional()
    @IsEmail({}, { message: 'Debe proporcionar un email válido' })
    email_patients?: string;

    @IsBoolean()
    is_active_patients: boolean;
    
    constructor(
        name_patients: string,
        last_name_patients: string,
        phone_patients: string,
        email_patients: string,
        is_active_patients: boolean,
        nif_patients?: string
    ) {
        this.nif_patients = nif_patients;
        this.name_patients = name_patients;
        this.last_name_patients = last_name_patients;
        this.phone_patients = phone_patients;
        this.email_patients = email_patients;
        this.is_active_patients = is_active_patients;
      }
}