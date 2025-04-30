
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty() @IsString() filename: string;
  @IsNotEmpty() @IsString() url: string;
  @IsNotEmpty() @IsString() mimetype: string; 
}
