import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { UserRole } from "../enums/rol.enum";

export class UpdateUserDto{
    
    @IsNumber()
    @IsInt()
    id_users:number;

    @IsOptional()
    @IsString()
    password_users?: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'rol_users debe ser uno de: admin, dentista' })
    rol_users?: UserRole;
}