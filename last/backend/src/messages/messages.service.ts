
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private repo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
  ) {}

  async send(project: Project, dto: SendMessageDto, sender: User): Promise<Message> {
    // FETCH full sender and project entities
    const fullSender = await this.userRepo.findOne({ where: { id: sender.id } });
    const fullProject = await this.projectRepo.findOne({ where: { id: project.id } });

    if (!fullSender) throw new NotFoundException('Sender not found');
    if (!fullProject) throw new NotFoundException('Project not found');

    const message = this.repo.create({
      text: dto.text,
      sender: fullSender,
      project: fullProject,
    });

    const saved = await this.repo.save(message);

    const fullMessage = await this.repo.findOne({
      where: { id: saved.id },
      relations: [
        'project',
        'project.client',
        'project.assignedFreelancer',
        'sender',
      ],
    });

    if (!fullMessage) {
      throw new NotFoundException('Message not found after save.');
    }

    return fullMessage;
  }

  async findThread(projectId: number): Promise<Message[]> {
    return this.repo.find({
      where: { project: { id: projectId } },
      order: { sentAt: 'ASC' },
      relations: ['sender'],
    });
  }
}
