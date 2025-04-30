
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty() @IsString()           title: string;
  @IsNotEmpty() @IsString()           category: string;
  @IsNotEmpty() @IsString()           description: string;
  @IsNotEmpty() @IsNumber()           budget: number;
  @IsNotEmpty() @IsDateString()       deadline: string;
}
