

import {
  Controller, Post, Get, Patch, Delete,
  Body, Param, Request, UseGuards,
  NotFoundException, BadRequestException
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/Decorators/roles.decorator';
import { RoleType } from '../common/role.entity';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
  ) {}
 


  @UseGuards(AuthGuard('jwt'), RolesGuard)
@Get('my')
@Roles(RoleType.CLIENT)
async fetchMyProjects(@Request() req) {
  const user = req.user;

console.log('User roles:', req.user.roles);  

  console.log('User object:', user);  

  const userId = Number(user.id);  

  if (!userId || isNaN(userId)) {
    throw new BadRequestException('User ID not found in the token');
  }

  return this.projectsService.getMyProjects(userId);
}




@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleType.CLIENT)
@Post()
async create(
  @Body() createProjectDto: CreateProjectDto,
  @Request() req,
) {
  console.log(' req.user in create():', req.user);
 
  const clientId = req.user?.id ?? req.user?.sub;

  if (!clientId || isNaN(clientId)) {
    throw new BadRequestException('Invalid user ID in request');
  }

  return this.projectsService.create({
    ...createProjectDto,
    clientId: Number(clientId),
  });
}


  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('freelancer')
  @Roles(RoleType.FREELANCER)
  async fetchForFreelancerProjects() {
    
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const projectId = Number(id);
    if (isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }
    return this.projectsService.findOne(projectId);
  }

  @Patch(':id')
  @Roles(RoleType.CLIENT)
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    const projectId = Number(id);
    if (isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }
    return this.projectsService.update(projectId, dto);
  }

  @Delete(':id')
  @Roles(RoleType.CLIENT)
  async remove(@Param('id') id: string) {
    const projectId = Number(id);
    if (isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }
    return this.projectsService.remove(projectId);
  }

  @Patch(':id/assign')
  @Roles(RoleType.CLIENT)
  async assign(
    @Param('id') id: string,
    @Body('freelancerId') freelancerId: number,
  ) {
    const projectId = Number(id);
    if (isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }
    if (isNaN(freelancerId)) {
      throw new BadRequestException('Invalid freelancer ID');
    }

    const freelancer = await this.usersService.findById(freelancerId);
    if (!freelancer) {
      throw new NotFoundException(`Freelancer ${freelancerId} not found`);
    }

    return this.projectsService.assignFreelancer(projectId, freelancer);
  }



  // @Get('freelancer')
  // @Roles(RoleType.FREELANCER)
  // async fetchFreelancerProjects(@Request() req) {
  //   const freelancerId = req.user.sub; // Get the freelancer's ID from the authenticated user

  //   if (!freelancerId || isNaN(freelancerId)) {
  //     throw new BadRequestException('Freelancer ID not found in the token');
  //   }

  //   return this.projectsService.getFreelancerProjects(freelancerId);
  // }


 

}
  

