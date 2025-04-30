
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToMany
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  @Entity()
  export class Skill {
    @PrimaryGeneratedColumn() id: number;
    @Column({ unique: true }) name: string;
  
    @ManyToMany(() => User, u => u.skills)
    users: User[];
  }
  