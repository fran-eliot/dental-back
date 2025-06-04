import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";

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
}
