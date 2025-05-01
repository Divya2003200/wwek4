
import {
    Controller, Post, Get, Param, Body,
    UseGuards, Request
  } from '@nestjs/common';
  import { MessagesService } from './messages.service';
  import { SendMessageDto } from './dto/send-message.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/Decorators/roles.decorator';
  import { RoleType } from '../common/role.entity';
  import { ProjectsService } from '../projects/projects.service';
  
  @Controller('projects/:projectId/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class MessagesController {
    constructor(
      private msgs: MessagesService,
      private projects: ProjectsService,
    ) {}
  
    @Post()
    @Roles(RoleType.CLIENT, RoleType.FREELANCER)
    async send(
      @Param('projectId') pid: string,
      @Body() dto: SendMessageDto,
      @Request() req
    ) {
      const project = await this.projects.findOne(+pid);
      return this.msgs.send(project, dto, req.user);
    }
  
    @Get()
    @Roles(RoleType.CLIENT, RoleType.FREELANCER)
    findThread(@Param('projectId') pid: string) {
      return this.msgs.findThread(+pid);
    }
  }
  