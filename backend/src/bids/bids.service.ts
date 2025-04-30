// src/bids/bids.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bids.entity';
import { CreateBidDto } from './dto/create-bid.sto';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private repo: Repository<Bid>,
  ) {}

  async create(project: Project, dto: CreateBidDto, freelancer: User): Promise<Bid> {
    const bid = this.repo.create({ ...dto, project, freelancer });
    return this.repo.save(bid);
  }

  async findByProject(projectId: number): Promise<Bid[]> {
    return this.repo.find({ where: { project: { id: projectId } } });
  }

  async findOne(id: number): Promise<Bid> {
    const bid = await this.repo.findOne({ where: { id } });
    if (!bid) throw new NotFoundException('Bid not found');
    return bid;
  }
}
