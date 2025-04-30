
import {
    Controller, Post, Get, Patch,
    Param, Body, UseGuards
  } from '@nestjs/common';
  import { MilestonesService } from './milestones.service';
  import { CreateMilestoneDto } from './dto/create-milestone.dto';
  import { UpdateMilestoneDto } from './dto/update-milestone.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/Decorators/roles.decorator';
  import { RoleType } from '../common/role.entity';
  import { ProjectsService } from '../projects/projects.service';
  
  @Controller('projects/:projectId/milestones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class MilestonesController {
    constructor(
      private ms: MilestonesService,
      private projects: ProjectsService,
    ) {}
  
    @Post()
    @Roles(RoleType.CLIENT)
    async create(
      @Param('projectId') pid: string,
      @Body() dto: CreateMilestoneDto
    ) {
      const project = await this.projects.findOne(+pid);
      return this.ms.create(project, dto);
    }
  
    @Get()
    @Roles(RoleType.CLIENT, RoleType.FREELANCER)
    findByProject(@Param('projectId') pid: string) {
      return this.ms.findByProject(+pid);
    }
  
    @Patch(':id')
    @Roles(RoleType.CLIENT)
    update(
      @Param('id') id: string,
      @Body() dto: UpdateMilestoneDto
    ) {
      return this.ms.update(+id, dto);
    }
  }
  