
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateMilestoneDto } from './create-milestone.dto';
// import { IsNotEmpty, IsString, IsIn } from 'class-validator';

// export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {
   
// }



import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateMilestoneDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'completed'])
  status: 'pending' | 'completed';  
}
