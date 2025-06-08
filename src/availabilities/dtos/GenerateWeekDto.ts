import { IsDateString } from "class-validator";

export class GenerateWeekDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}