import { IsInt, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class FindTreatmentDto {
  @IsInt()
  @IsOptional()
  id_treatments?: number;

  @IsString()
  @IsOptional()
  name_treatments?: string;

  @IsString()
  @IsOptional()
  type_treatments?: string;

  @IsInt()
  @IsOptional()
  duration_minutes_treatments?: number;

  @IsNumber()
  @IsOptional()
  price_treatments?: number;

  @IsBoolean()
  @IsOptional()
  visible_to_patients_treatments?: boolean;

  @IsBoolean()
  @IsOptional()
  is_active_treatments?: boolean;

  constructor(
    id_treatments?: number,
    name_treatments?: string,
    type_treatments?: string,
    duration_minutes_treatments?: number,
    price_treatments?: number,
    visible_to_patients_treatments?: boolean,
    is_active_treatments?: boolean,
  ) {
    this.id_treatments = id_treatments;
    this.name_treatments = name_treatments;
    this.type_treatments = type_treatments;
    this.duration_minutes_treatments = duration_minutes_treatments;
    this.price_treatments = price_treatments;
    this.visible_to_patients_treatments = visible_to_patients_treatments;
    this.is_active_treatments = is_active_treatments;
  }
}
