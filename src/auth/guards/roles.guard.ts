import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    console.log('Required Roles:', requiredRoles); // Debugging

    if (!requiredRoles) {
      return true; // No roles required, proceed
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('User in RolesGuard:', user); // Debugging

    if (!user) {
      console.error('User object not found on request in RolesGuard');
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.role) {
      console.error(
        'User role property not found on request.user in RolesGuard:',
        user,
      );
      throw new ForbiddenException('User role not found');
    }

    const hasRole = requiredRoles.some((role) => {
      if (typeof user.role === 'string') {
        return user.role === role; // Exact string match for single role
      } else if (Array.isArray(user.role)) {
        return user.role.includes(role); // Check if the required role is in the array
      }
      return false; // Role is neither string nor array, deny access
    });
    console.log('User Role:', user.role); // Debugging
    console.log('Has Required Role:', hasRole); // Debugging

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true; // User has the required role
  }
}
