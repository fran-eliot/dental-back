import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt } from "class-validator";

export class AvailabilityFilterDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: 'ID del profesional', example: 1 })
  professionalId: number;

  @IsDateString()
  @ApiProperty({ example: '2025-06-12', description: 'Fecha para consultar las disponibilidades (formato YYYY-MM-DD)' })
  date: string;
}