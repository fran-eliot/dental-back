import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto{
    @IsNotEmpty()
    @IsEmail()
    username_users: string;
    @IsNotEmpty()
    password_users: string;
}