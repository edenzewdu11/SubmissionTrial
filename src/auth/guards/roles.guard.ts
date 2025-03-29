import { Injectable } from '@nestjs/common';
import {
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
    // Get the required roles from the handler's metadata
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles required, proceed
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user exists and has a role
    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    // Check if the user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => user.role.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true; // User has the required role
  }
}
