import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { RoleType } from 'src/common/role.entity';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(RoleType)
  role: RoleType;
}
