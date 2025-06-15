import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { ProfessionalAvailability } from "src/availabilities/entities/ProfessionalAvailability";
import { Appointment } from "src/appointments/entities/appointment.entity";

@Entity('professionals')
export class Professional{
   
    @PrimaryGeneratedColumn()
    id_professionals: number;
  
    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id', referencedColumnName:'id_users' })
    user: User;

    @Column({ nullable: false })
    nif_professionals:string
    @Column({ nullable: false })
    license_number_professionals:string;
    @Column({ nullable: false })
    name_professionals:string;
    @Column({ nullable: false })
    last_name_professionals:string;
    @Column({ nullable: false })
    phone_professionals:string;
    @Column({ nullable: false })
    email_professionals:string;
    @Column()
    assigned_room_professionals:string;
    @Column({ default: true }) //1 activo 0 Inactivo, por defecto 1
    is_active_professionals:boolean

    @OneToMany(() => ProfessionalAvailability, pa => pa.professional)
    availabilities: ProfessionalAvailability[];

    @OneToMany(() => Appointment, appointment => appointment.professional)
    appointments: Appointment[];
}
