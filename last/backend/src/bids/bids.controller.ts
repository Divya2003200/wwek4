// src/bids/bids.controller.ts
import { Controller, Post, Get, Param, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.sto';
import { ProjectsService } from '../projects/projects.service';
import { Roles } from 'src/common/Decorators/roles.decorator';
import { RoleType } from 'src/common/role.entity';
import { RolesGuard } from '../common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)  // Protect all routes with JWT and Roles guards
@Controller('projects/:projectId/bids')
export class BidsController {
  constructor(
    private bidsService: BidsService,
    private projectsService: ProjectsService,
  ) {}

  // Freelancer can create a bid
  @Roles(RoleType.FREELANCER)  // Role-based protection
  @Post()
  async createBid(@Body() dto: CreateBidDto, @Request() req) {
    const freelancer = req.user;  // The authenticated user (freelancer)
    const project = await this.projectsService.findOne(dto.projectId);  // Get the project using the projectId
    return this.bidsService.create(project, dto, freelancer);  // Create the bid
  }

  // Client can view bids for a project
  @Roles(RoleType.CLIENT) 
  @Get()
  async findAll(@Param('projectId') pid: string) {
    return this.bidsService.findByProject(+pid);  // Get all bids for the project
  }
}
