import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/rol.enum';
//Utilizo esta libreria para excluir la contraseña de los datos que envio al front
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_users: number;

  @Column()
  username_users: string;

  @Column()
  @Exclude()//Aqui lo pongo tb para que no mande la contraseña
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