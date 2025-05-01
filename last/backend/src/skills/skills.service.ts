
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';
import { AddSkillDto } from './dto/add-skills.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private repo: Repository<Skill>,
    private users: UsersService,
  ) {}

  async addToUser(userId: number, dto: AddSkillDto) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    let skill = await this.repo.findOne({ where: { name: dto.name } });
    if (!skill) {
      skill = await this.repo.save(this.repo.create({ name: dto.name }));
    }
  
    user.skills = [...(user.skills || []), skill];
    await this.users.save(user);   
  
    return skill;
  }
  

  async findAll(): Promise<Skill[]> {
    return this.repo.find();
  }
}
