
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ProjectsModule } from '../projects/projects.module';
import { User } from 'src/users/user.entity';
import { Project } from 'src/projects/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File,User,Project]),
    ProjectsModule,
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
