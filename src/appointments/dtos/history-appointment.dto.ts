export class HistoryAppointmentDto {
  id_reserva: number;
  paciente_id: number;
  paciente: string;
  fecha_cita: string;
  tratamiento: string;
  motivo_cancelacion: string;
  profesional: string;
}