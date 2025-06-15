import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class FindPatientDto {
  @IsInt()
  @IsOptional()
  id_patients?: number;

  @IsString()
  @IsOptional()
  nif_patients?: string;

  @IsString()
  name_patients: string;

  @IsString()
  last_name_patients: string;

  @IsString()
  phone_patients: string;

  @IsString()
  email_patients: string;

  @IsBoolean()
  is_active_patients: boolean;

  constructor(
    name_patients: string,
    last_name_patients: string,
    phone_patients: string,
    email_patients: string,
    is_active_patients: boolean,
    id_patients?: number,
    nif_patients?: string
  ) {
    this.id_patients = id_patients;
    this.nif_patients = nif_patients;
    this.name_patients = name_patients;
    this.last_name_patients = last_name_patients;
    this.phone_patients = phone_patients;
    this.email_patients = email_patients;
    this.is_active_patients = is_active_patients;
  }
}
