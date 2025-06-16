// src/treatments/dto/create-treatment.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateTreatmentDto {
  @IsString()
  name_treatments: string;

  @IsString()
  type_treatments: string;

  @IsNumber()
  duration_minutes_treatments: number;

  @IsNumber()
  price_treatments: number;

  @IsOptional()
  @IsBoolean()
  visible_to_patients_treatments?: boolean;

  @IsBoolean()
  @IsOptional()
  is_active_treatments: boolean;
}
