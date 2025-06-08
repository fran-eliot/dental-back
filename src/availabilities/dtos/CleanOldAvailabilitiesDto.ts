import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CleanOldAvailabilitiesDto {
  @IsDateString()
  @ApiProperty({ example: '2025-06-01', description: 'Fecha límite. Se eliminarán las disponibilidades anteriores a esta (formato YYYY-MM-DD)' })
  beforeDate: string;
}