import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('treatments')
export class Treatment {
  @PrimaryGeneratedColumn()
  id_treatments: number;

  @Column({ length: 100 })
  name_treatments: string;

  @Column({ length: 50, nullable: true })
  type_treatments?: string;

  @Column()
  duration_minutes_treatments: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price_treatments: number;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  visible_to_patients_treatments?: boolean;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  is_active_treatments: boolean;

  @OneToMany(() => Appointment, appointment => appointment.treatment)
  appointments: Appointment[];
}
