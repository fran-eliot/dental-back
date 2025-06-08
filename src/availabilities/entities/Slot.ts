import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProfessionalAvailability } from "./ProfessionalAvailability";

@Entity('slots')
export class Slot{
    @PrimaryGeneratedColumn(({ name: 'id_slots' }))
    id: number;

    @Column({ name: 'start_time_slots', type: 'time' })
    startTime: string;

    @Column({ name:'end_time_slots', type: 'time' })
    endTime: string;

    @Column({ name:'period', type: 'enum', enum: ['mañana', 'tarde'] })
    period: 'mañana' | 'tarde';

    @OneToMany(() => ProfessionalAvailability, pa => pa.slot)
    professionalAvailabilities: ProfessionalAvailability[];

}