
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, CreateDateColumn
  } from 'typeorm';
  import { Project } from '../projects/project.entity';
  import { Invoice } from '../invoices/invoice.entity';
  
  @Entity()
  export class Milestone {
    @PrimaryGeneratedColumn() id: number;
  
    @Column()                title: string;
    @Column()                dueDate: string;
    @Column('decimal')       amount: number;
    @Column({ default: 'pending' }) status: 'pending' | 'completed';
  
    @ManyToOne(() => Project, p => p.milestones, { onDelete: 'CASCADE' })
                             project: Project;
  
    @OneToMany(() => Invoice, inv => inv.milestone)
                             invoices: Invoice[];
  
    @CreateDateColumn()       createdAt: Date;
  }
  