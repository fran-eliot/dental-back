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

  @Column({ default: true })
  visible_to_patients_treatments?: boolean;

  @Column({ default: true })
  is_active_treatments: boolean;

  @OneToMany(() => Appointment, appointment => appointment.treatment)
  appointments: Appointment[];

  constructor(
    id_treatments: number,
    name_treatments: string,
    type_treatments: string,
    duration_minutes_treatments: number,
    price_treatments: number,
    visible_to_patients_treatments: boolean,
    is_active_treatments: boolean
  ){
    this.id_treatments = id_treatments;
    this.name_treatments = name_treatments;
    this.type_treatments = type_treatments;
    this.duration_minutes_treatments = duration_minutes_treatments;
    this.price_treatments = price_treatments;
    this.visible_to_patients_treatments = visible_to_patients_treatments;
    this.is_active_treatments = is_active_treatments;
  }

}
