
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skills/skill.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,

        @InjectRepository(Skill)   
    private readonly skillRepo: Repository<Skill>,
      ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['roles'] });
  }

  // findById(id: number) {
  //   return this.repo.findOne({ where: { id }, relations: ['roles'] });
  // }

  
  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['roles'],
    });
  }
  

  async update(id: number, dto: UpdateUserDto) {
    await this.repo.update(id, dto);
    const updated = await this.findById(id);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  // async updateSkills(userId: number, skills: Skill[]) {
  //   const user = await this.repo.findOne({
  //     where: { id: userId },
  //     relations: ['skills', 'roles'],
  //   });
  
  //   if (!user) {
  //     throw new NotFoundException(`User with id ${userId} not found`);
  //   }
  
  //   const isFreelancer = user.roles.some(role => role.name === 'freelancer');
  //   if (!isFreelancer) {
  //     throw new Error('Only freelancers can have skills');
  //   }
  
  //   user.skills = skills;
  //   return this.repo.save(user);
  // }

  async updateSkills(userId: number, skills: Skill[]) {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ['skills', 'roles'],
    });
  
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    const isFreelancer = user.roles.some(role => role.name === 'freelancer');
    if (!isFreelancer) {
      throw new Error('Only freelancers can have skills');
    }
  
    const skillIds = skills.map(skill => skill.id);
    const realSkills = await this.skillRepo.findByIds(skillIds);
  
    user.skills = realSkills;
  
    return this.repo.save(user);
  }
    
  async save(user: User) {
    return this.repo.save(user);
  }
  
  
}


