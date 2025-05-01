
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ProjectsService } from '../projects/projects.service';
import { MilestonesService } from '../milestones/milestones.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private repo: Repository<Invoice>,
    private projects: ProjectsService,
    private milestones: MilestonesService,
  ) {}

  // async create(dto: CreateInvoiceDto): Promise<Invoice> {
  //   const ms = await this.milestones.update(dto.milestoneId, {});
  //   const project = await this.projects.findOne(ms.project.id);
  //   const inv = this.repo.create({ milestone: ms, project });
  //   return this.repo.save(inv);
  // }

  async markPaid(id: number): Promise<Invoice> {
    await this.repo.update(id, { paid: true });
    const inv = await this.repo.findOne({ where: { id } });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }

  async findByProject(projectId: number): Promise<Invoice[]> {
    return this.repo.find({ where: { project: { id: projectId } } });
  }

 
// async create(dto: CreateInvoiceDto): Promise<Invoice> {
//   // fetch milestone (instead of “updating” it)
//   const ms = await this.milestones.findOne(dto.milestoneId);

//   // now ms.project is defined
//   const project = await this.projects.findOne(ms.project.id);

//   const inv = this.repo.create({ milestone: ms, project });
//   return this.repo.save(inv);
// }




async create(dto: CreateInvoiceDto): Promise<Invoice> {
  // Fetch the milestone using the milestoneId
  const ms = await this.milestones.findOne(dto.milestoneId);
  if (!ms) {
    throw new Error('Milestone not found');
  }

  // Fetch the associated project from the milestone's project field
  const project = await this.projects.findOne(ms.project.id);

  if (!project) {
    throw new Error('Project not found');
  }

  // Create the invoice, ensuring the milestone and project are correctly set
  const inv = this.repo.create({
    milestone: ms,
    project,
    paid: false,  // Default 'paid' as false
    issuedAt: new Date(),  // Default to the current date when the invoice is created
  });

  // Save the created invoice
  return this.repo.save(inv);
}



}
