import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProfessionalAvailability } from "./ProfessionalAvailability";

@Entity('slots')
export class Slot{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'enum', enum: ['mañana', 'tarde'] })
    period: 'mañana' | 'tarde';

    @OneToMany(() => ProfessionalAvailability, pa => pa.slot)
    professionalAvailabilities: ProfessionalAvailability[];

}