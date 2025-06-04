import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FindProfessionalDto{
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    id_professionals: number;
    @IsString()
    nif_professionals:string
    @IsString()   
    license_number_professionals:string;
    @IsString()      
    name_professionals:string;
    @IsString()     
    last_name_professionals:string;
    @IsInt() 
    phone_professionals:string;
    @IsEmail()
    email_professionals:string;
    @IsOptional()
    @IsString()   
    assigned_room_professionals:string;
    @IsBoolean()   
    is_active_professionals:boolean

    constructor(
        id_professionals?: number,nif_professionals?: string,
        license_number_professionals?: string, name_professionals?: string, loast_name_professionals?: string,
        phone_professionals?: string, email_professionals?: string, assigned_room_professionals?: string, is_active_professionals?: boolean
    ) {
        this.id_professionals = id_professionals;
        this.nif_professionals = nif_professionals;
        this.license_number_professionals = license_number_professionals;
        this.name_professionals = name_professionals;
        this.last_name_professionals = loast_name_professionals;
        this.phone_professionals = phone_professionals;
        this.email_professionals = email_professionals;
        this.assigned_room_professionals = assigned_room_professionals;
        this.is_active_professionals = is_active_professionals;
    }
}