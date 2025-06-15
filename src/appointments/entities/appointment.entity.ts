import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Professional } from 'src/professional/entities/profesional.entity';
import { Treatment } from 'src/treatments/entities/treatment.entity';
import { Slot } from 'src/availabilities/entities/Slot';
import { StatusAppointments } from '../enums/statusAppointments.enum';
import { CreatedAppointments } from '../enums/createdAppointments.enum';
import { Patient } from 'src/patients/entities/patient.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id_appointments: number;

  @ManyToOne(() => Patient, patient => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Professional, professional => professional.appointments)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @ManyToOne(() => Treatment, treatment => treatment.appointments)
  @JoinColumn({ name: 'treatments_id' })
  treatment: Treatment;

  @ManyToOne(() => Slot, slot => slot.appointments)
  @JoinColumn({ name: 'slot_id' })
  slot: Slot;

  @Column({ type: 'date' })
  date_appointments: string;

  @Column()
  duration_minutes_appointments: number;

  @Column({
    type: 'enum',
    enum: StatusAppointments,
    default: StatusAppointments.PENDIENTE,
  })
  status_appointments: StatusAppointments;

  @Column({ type: 'longtext', nullable: true })
  cancellation_reason_appointments: string;

  @Column({
    type: 'enum',
    enum: CreatedAppointments,
    default: CreatedAppointments.ADMIN,
  })
  created_by_appointments: CreatedAppointments;
}
