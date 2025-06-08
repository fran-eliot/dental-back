import { IsEnum } from "class-validator";
import { Status } from "../enums/status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAvailabilityStatusDto {
  @ApiProperty({ enum: Status, description: 'Nuevo estado de la disponibilidad' })
  @IsEnum(Status, { message: 'El estado debe ser libre, reservado o no disponible' })
  status: Status;
}