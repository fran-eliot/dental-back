import { IsArray, IsInt, IsNotEmpty, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { FindPatientDto } from './find-patient.dto';

export class PaginatedPatientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FindPatientDto)
  data: FindPatientDto[];

  @IsInt()
  @Min(0)
  total: number;

  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  pageSize: number;

  constructor(data: FindPatientDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
  }
}
