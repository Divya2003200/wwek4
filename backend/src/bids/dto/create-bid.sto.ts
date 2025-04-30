
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;  // in days

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;  
}
