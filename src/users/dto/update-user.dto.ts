import { IsBoolean, IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { UserRole } from "../enums/rol.enum";

export class UpdateUserDto{
    
    @IsNumber()
    @IsInt()
    id_users:number;

    @IsOptional()
    @IsEmail()
    username_users?: string;

    @IsOptional()
    @IsString()
    password_users?: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'rol_users debe ser uno de: admin, dentista' })
    rol_users?: UserRole;

    @IsOptional()
    @IsBoolean()
    is_active_users?: boolean; // Opcional

    constructor(id_users?:number, username_users?:string, rol_users?:UserRole, is_active_users?:boolean){
        this.id_users = id_users;
        this.password_users = this.password_users;
        this.rol_users = rol_users;
        this.is_active_users = is_active_users;
    }
}