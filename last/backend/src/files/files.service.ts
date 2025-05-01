
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepo: Repository<File>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
  ) {}

  async create(
    userId: number,
    projectId: number,
    file: Express.Multer.File,
  ): Promise<File> {
    // 1) load uploader
    const uploader = await this.userRepo.findOne({ where: { id: userId } });
    if (!uploader) throw new NotFoundException('Uploader not found');

    // 2) load project and ensure access
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer', 'files'],
    });
    if (!project) throw new NotFoundException('Project not found');

    // optional: only allow uploader if they’re the client or assigned freelancer
    const isClient = project.client.id === userId;
    const isFreelancer =
      project.assignedFreelancer && project.assignedFreelancer.id === userId;
    if (!isClient && !isFreelancer) {
      throw new ForbiddenException('Not authorized to upload to this project');
    }

    // 3) create metadata record
    const entity = this.fileRepo.create({
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      uploader,
      project,
    });

    // 4) persist and return
    return this.fileRepo.save(entity);
  }



  async findAll(projectId: number): Promise<File[]> {
    return this.fileRepo.find({
      where: { project: { id: projectId } },
      relations: ['uploader', 'project'],
      order: { uploadedAt: 'DESC' },
    });
  }
}
