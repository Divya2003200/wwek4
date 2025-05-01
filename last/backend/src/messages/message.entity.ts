
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn,
    JoinColumn
  } from 'typeorm';
  import { User } from '../users/user.entity';
  import { Project } from '../projects/project.entity';
  
  @Entity()
  export class Message {
    @PrimaryGeneratedColumn() id: number;
  
    @Column('text')           text: string;
  
    @ManyToOne(() => User, u => u.messages, { eager: true })
                               sender: User;
  
    @ManyToOne(() => Project, p => p.messages, { onDelete: 'CASCADE' })
                               project: Project;
  
    @CreateDateColumn()        sentAt: Date;

  
  }
  