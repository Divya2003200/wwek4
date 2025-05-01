// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// export enum RoleType {
//   CLIENT = 'client',
//   FREELANCER = 'freelancer',
// }

// @Entity()
// export class Role {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'enum', enum: RoleType, unique: true })
//   name: RoleType;
//     static CLIENT: any;
//     static FREELANCER: any;
// }


import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { User } from '../users/user.entity';


export enum RoleType {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'enum', enum: RoleType, unique: true })
  name: RoleType;

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}
