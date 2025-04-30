// src/bids/bid.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
  } from 'typeorm';
  import { User } from '../users/user.entity';
  import { Project } from '../projects/project.entity';
  
  @Entity()
  export class Bid {
    @PrimaryGeneratedColumn()    id: number;
  
    @Column('decimal')           amount: number;
    @Column()                   duration: number;
    @Column('text')             message: string;
  
    @ManyToOne(() => User, u => u.bids, { eager: true })
                                freelancer: User;
  
    @ManyToOne(() => Project, p => p.bids, { onDelete: 'CASCADE' })
                                project: Project;
  
    @CreateDateColumn()          createdAt: Date;
  }
  