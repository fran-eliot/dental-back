
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRole } from "../enums/rol.enum";

export class FindUserDto {
    @IsNotEmpty()
    @IsNumber()
    id_users:number;

    @IsNotEmpty()
    @IsEmail()
    username_users: string;

    @IsNotEmpty()
    @IsString()
    rol_users: UserRole;

    @IsBoolean()
    is_active_users?: boolean; // Opcional

    constructor(id_users?:number, username_users?:string, rol_users?:UserRole, is_active_users?:boolean){
        this.id_users = id_users;
        this.username_users = username_users;
        this.rol_users = rol_users;
        this.is_active_users = is_active_users;
    }
}