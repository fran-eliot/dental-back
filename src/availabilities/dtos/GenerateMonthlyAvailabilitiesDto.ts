import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, Max, Min } from "class-validator";

export class GenerateMonthlyAvailabilitiesDto {
  @ApiProperty({ example: 7, description: 'Mes del año (1 = Enero, 12 = Diciembre)' })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number; // 1 = Enero

  @ApiProperty({ example: 2025, description: 'Año para el que se quieren generar las disponibilidades' })
  @IsInt()
  @Min(2025)
  @Max(2030)
  year: number;
}
