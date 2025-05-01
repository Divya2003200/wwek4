
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
  } from 'typeorm';
  import { Project } from '../projects/project.entity';
  import { Milestone } from '../milestones/milestone.entity';
  
  @Entity()
  export class Invoice {
    @PrimaryGeneratedColumn() id: number;
  
    @ManyToOne(() => Project, p => p.invoices, { eager: true })
                            project: Project;
  
    @ManyToOne(() => Milestone, m => m.invoices, { eager: true })
                            milestone: Milestone;
  
    @Column({ default: false }) paid: boolean;
  
    @CreateDateColumn()        issuedAt: Date;
  }
  