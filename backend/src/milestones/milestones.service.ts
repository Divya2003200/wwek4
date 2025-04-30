
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Project } from '../projects/project.entity';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone) private repo: Repository<Milestone>,
  ) {}

  async create(project: Project, dto: CreateMilestoneDto): Promise<Milestone> {
    const m = this.repo.create({ ...dto, project });
    return this.repo.save(m);
  }

  async findByProject(projectId: number): Promise<Milestone[]> {
    return this.repo.find({ where: { project: { id: projectId } } });
  }

  async update(id: number, dto: UpdateMilestoneDto): Promise<Milestone> {
    await this.repo.update(id, dto);
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Milestone not found');
    return m;
  }

 
async findOne(id: number): Promise<Milestone> {
  const m = await this.repo.findOne({
    where: { id },
    relations: ['project'],    // load project so ms.project.id works
  });
  if (!m) throw new NotFoundException('Milestone not found');
  return m;
}

// you can leave update(...) as-is or remove its call site


}
