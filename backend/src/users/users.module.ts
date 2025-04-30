// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService }    from './users.service';
import { UsersController } from './users.controller';
import { User }            from './user.entity';
import { Role } from 'src/common/role.entity';
import { Skill } from 'src/skills/skill.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([User,Role,Skill]),
  ],
  providers: [
    UsersService,            
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
