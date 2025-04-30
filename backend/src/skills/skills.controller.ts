
import {
    Controller, Post, Get, Body, Request,
    UseGuards
  } from '@nestjs/common';
  import { SkillsService } from './skills.service';
  import { AddSkillDto } from './dto/add-skills.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/Decorators/roles.decorator';
  import { RoleType } from '../common/role.entity';
  
  @Controller('skills')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class SkillsController {
    constructor(private skills: SkillsService) {}
  
    @Post()
    @Roles(RoleType.FREELANCER)
    add(@Body() dto: AddSkillDto, @Request() req) {
      return this.skills.addToUser(req.user.sub, dto);
    }
  
    @Get()
    @Roles(RoleType.CLIENT, RoleType.FREELANCER)
    findAll() {
      return this.skills.findAll();
    }
  }
  