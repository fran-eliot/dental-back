import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id_patients: number;

  @Column({ nullable: true })
  nif_patients?: string;

  @Column()
  name_patients: string;

  @Column()
  last_name_patients: string;

  @Column()
  phone_patients: string;

  @Column()
  email_patients: string;

  @Column({ default: true })
  is_active_patients: boolean;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];
}
