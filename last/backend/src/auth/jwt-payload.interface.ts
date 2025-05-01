import { RoleType } from '../common/role.entity';

export interface JwtPayload {
  sub: number;        
  email: string;
  roles: RoleType[];  
}
