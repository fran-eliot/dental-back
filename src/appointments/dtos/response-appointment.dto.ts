export class AppointmentResponseDto {
  paciente: string;
  tratamiento: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  duracion: number;
  motivo_cancelacion?: string;
  creado_por?: string;
}