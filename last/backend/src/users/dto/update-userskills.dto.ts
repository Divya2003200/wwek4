// src/users/dto/update-user-skills.dto.ts
import { Skill } from '../../skills/skill.entity';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserSkillsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Skill)
  skills: Skill[];
}
