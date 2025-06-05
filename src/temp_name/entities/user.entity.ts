import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/rol.enum';
import { Professional } from 'src/professional/entities/profesional.entity';


@Entity('users')
export class User {
  
  @PrimaryGeneratedColumn()
  id_users: number;

  @Column()
  username_users: string;

  @Column()
  password_users: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DENTIST,
  })
  rol_users: UserRole;

  @Column({ default: true })
  is_active_users: boolean;

}