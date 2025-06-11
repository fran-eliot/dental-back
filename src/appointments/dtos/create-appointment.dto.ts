import { IsInt, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { StatusAppointments } from '../enums/statusAppointments.enum';
import { CreatedAppointments } from '../enums/createdAppointments.enum';


export class CreateAppointmentDto {
  @IsInt()
  patient_id: number;

  @IsInt()
  @IsOptional()
  professional_id?: number;

  @IsInt()
  @IsOptional()
  treatments_id?: number;

  @IsInt()
  slot_id: number;

  @IsDateString()
  date_appointments: string;

  @IsInt()
  @IsOptional()
  duration_minutes_appointments?: number;

  @IsEnum(StatusAppointments)
  @IsOptional()
  status_appointments?: StatusAppointments = StatusAppointments.PENDIENTE;

  @IsString()
  @IsOptional()
  cancellation_reason_appointments?: string;

  @IsEnum(CreatedAppointments)
  @IsOptional()
  created_by_appointments?: CreatedAppointments = CreatedAppointments.ADMIN;
}
