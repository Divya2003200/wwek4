
import {
    Entity, PrimaryGeneratedColumn, Column,
    OneToMany, ManyToMany, JoinTable
  } from 'typeorm';
  import { Role } from '../common/role.entity';
  import { Project } from '../projects/project.entity';      
  import { Bid } from '../bids/bids.entity';                  
  import { Message } from '../messages/message.entity';      
  import { Skill } from 'src/skills/skill.entity';

  @Entity()
  export class User {
    @PrimaryGeneratedColumn() id: number;
  
    @Column({ unique: true }) email: string;
    @Column() password: string;
    @Column() name: string;
    @Column({ nullable: true }) bio: string;
    @Column({ nullable: true }) profileImage: string;
    @Column({ default: false }) isEmailVerified: boolean;
  
    @ManyToMany(() => Role,{eager:true})
    @JoinTable()
    roles: Role[];
  
    // ← Add these relations:
  
    @OneToMany(() => Project, project => project.client)
    projects: Project[];                       // projects this user created
  
    @OneToMany(() => Project, project => project.assignedFreelancer)
    assignedProjects: Project[];               // projects assigned to this user
  
    @OneToMany(() => Bid, bid => bid.freelancer)
    bids: Bid[];                               // bids this user made
  
    @OneToMany(() => Message, msg => msg.sender)
    messages: Message[];                       // messages this user sent

    @ManyToMany(() => Skill, skill => skill.users)
@JoinTable()
skills: Skill[];
  }
  

