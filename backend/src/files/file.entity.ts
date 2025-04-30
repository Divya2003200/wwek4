
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
  } from 'typeorm';
  import { User } from '../users/user.entity';
  import { Project } from '../projects/project.entity';
  
  @Entity()
  export class File {
    @PrimaryGeneratedColumn() id: number;
  
    @Column()                filename: string;
    @Column()                url: string;
    @Column()                mimetype: string;
  
    @ManyToOne(() => User, u => u.messages) // reuse messages relation or add uploader relation
                               uploader: User;
  
    @ManyToOne(() => Project, p => p.files, { onDelete: 'CASCADE' })
                               project: Project;
  
    @CreateDateColumn()       uploadedAt: Date;
  }
  