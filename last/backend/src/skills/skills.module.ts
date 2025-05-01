
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Skill]), UsersModule ],
  providers: [SkillsService],
  controllers: [SkillsController],
})
export class SkillsModule {}
