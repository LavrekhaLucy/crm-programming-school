import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserRequest } from '../interfaces/user-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<UserRequest>();

    const role = request.user?.role;

    if (!role) {
      return false;
    }
    console.log('USER FROM JWT:', request.user);
    console.log('REQUIRED ROLES:', requiredRoles);

    return requiredRoles.includes(role);
  }
}
