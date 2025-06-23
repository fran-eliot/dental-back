import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateTreatmentDto {
  @IsString()
  name_treatments: string;

  @IsString()
  type_treatments: string;

  @IsNumber()
  duration_minutes_treatments: number;

  @IsNumber()
  price_treatments: number;

  @IsBoolean()
  visible_to_patients_treatments: boolean;

  @IsBoolean()
  is_active_treatments: boolean;
}
