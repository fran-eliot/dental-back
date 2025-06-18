import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusAppointments } from '../enums/statusAppointments.enum';


export class UpdateAppointmentDto {
    @IsEnum(StatusAppointments, {
     message: 'El estado debe ser: pendiente, confirmada, cancelada o realizada',
    })
    status_appointments: StatusAppointments;

    @IsString()
    @IsOptional()
    cancellation_reason_appointments?: string;
  
}