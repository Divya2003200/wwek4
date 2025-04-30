import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message } from './message.entity'; // Import the Message entity
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message,User,Project]),ProjectsModule], // Register the Message entity here
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
