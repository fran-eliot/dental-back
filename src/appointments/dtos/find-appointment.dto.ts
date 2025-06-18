import { IsInt, IsEnum, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { StatusAppointments } from '../enums/statusAppointments.enum';
import { CreatedAppointments } from '../enums/createdAppointments.enum';
import { Type } from 'class-transformer';


export class FindAppointmentDto {
  @IsInt()
  @IsOptional()
  id_appointments?:number;

  @IsInt()
  @IsOptional()
  patient_id?: number;

  @IsInt()
  @IsOptional()
  professional_id?: number;

  @IsInt()
  @IsOptional()
  treatments_id?: number;

  @IsInt()
  @IsOptional()
  slot_id?: number;

  @IsDateString()
  @IsOptional()
  date_appointments?: string;

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
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;

  constructor(id_appointments?: number, patient_id?: number, professional_id?: number, treatments_id?: number, slot_id?: number, date_appointments?: string, duration_minutes_appointments?: number, status_appointments?: StatusAppointments, cancellation_reason_appointments?: string, created_by_appointments?: CreatedAppointments) {
    this.id_appointments = id_appointments;
    this.patient_id = patient_id;
    this.professional_id = professional_id;
    this.treatments_id = treatments_id;
    this.slot_id = slot_id;
    this.date_appointments = date_appointments;
    this.duration_minutes_appointments = duration_minutes_appointments;
    this.status_appointments = status_appointments;
    this.cancellation_reason_appointments = cancellation_reason_appointments;
    this.created_by_appointments = created_by_appointments;
  }
}
