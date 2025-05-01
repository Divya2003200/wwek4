// // src/common/guards/roles.guard.ts
// import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../Decorators/roles.decorator';
// import { Role } from '../role.entity';

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../Decorators/roles.decorator";
import { RoleType } from "../role.entity";

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) return true;

//     const { user } = context.switchToHttp().getRequest();
//     if (!user) {
//       throw new UnauthorizedException('User not authenticated');
//     }

//     if (!requiredRoles.some(role => user.roles.includes(role))) {
//       throw new ForbiddenException('Insufficient role');
//     }
//     return true;
//   }
// }

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Log user roles and required roles for debugging
    console.log('User Roles:', user.roles);  // Logs user roles array
    console.log('Required Roles:', requiredRoles);  // Logs required roles array

    // Ensure the user has one of the required roles by comparing role names
    if (!requiredRoles.some(role => user.roles.some(userRole => userRole.name === role))) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
