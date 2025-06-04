//Lo voy a utilizar para la respuesta cuando creo el profesional que me traiga el id_users

import { IsInt, IsNotEmpty } from "class-validator";

export class ResponseProfessionalDto{
    @IsInt()
    @IsNotEmpty()
    user_id:number;
}