import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Slot } from "./Slot";
import { Professional } from "src/professional/entities/profesional.entity";

@Entity('professional_availabilities')
export class ProfessionalAvailability {
  @PrimaryGeneratedColumn({ name: 'id_professional_availabilities' })
  id: number;

  @Column({ name: 'date_availability', type: 'date' })
  date: Date;

  @Column({ name: 'status_availability', type: 'enum', enum: ['libre', 'reservado', 'no disponible'] })
  status: 'libre' | 'reservado' | 'no disponible';

  @ManyToOne(() => Slot, slot => slot.professionalAvailabilities)
  @JoinColumn({ name: 'slot_id' })
  slot: Slot;

  @ManyToOne(() => Professional, professional => professional.availabilities)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;


}