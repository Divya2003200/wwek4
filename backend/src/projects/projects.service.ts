


import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto & { clientId: number }) {
    if (isNaN(createProjectDto.clientId)) {
      throw new BadRequestException('Invalid clientId');
    }
 
    const project = this.projectRepo.create(createProjectDto);
    return await this.projectRepo.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepo.find();
  }

  async findOne(id: number): Promise<Project> {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid project ID');
    }

    const proj = await this.projectRepo.findOne({ where: { id } });
    if (!proj) throw new NotFoundException('Project not found');
    return proj;
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    if (!project) throw new NotFoundException('Project not found');

    await this.projectRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid project ID');
    }

    const res = await this.projectRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Project not found');
  }

  async assignFreelancer(id: number, freelancer: User): Promise<Project> {
    const proj = await this.findOne(id);
    if (!proj) throw new NotFoundException('Project not found');

    proj.assignedFreelancer = freelancer;
    proj.assignedFreelancerId = freelancer.id;
    proj.status = 'assigned';
    return this.projectRepo.save(proj);
  }

  async getMyProjects(userId: number): Promise<Project[]> {
    if (isNaN(userId)) {
      throw new BadRequestException('User ID is not a valid number');
    }

    return this.projectRepo.find({
      where: { clientId: userId },
      relations: [
        'client',
        'assignedFreelancer',
        'client.roles',
        'assignedFreelancer.roles',
      ],
    });
  }



  // async getFreelancerProjects(freelancerId: number): Promise<Project[]> {
  //   if (isNaN(freelancerId)) {
  //     throw new BadRequestException('Freelancer ID is not a valid number');
  //   }

  //   // Fetch projects where the freelancer is assigned
  //   const projects = await this.projectRepo.find({
  //     where: { assignedFreelancerId: freelancerId },
  //     relations: ['client', 'assignedFreelancer'],
  //   });

  //   if (!projects || projects.length === 0) {
  //     throw new NotFoundException('No projects assigned to this freelancer');
  //   }

  //   return projects;
  // }
}
