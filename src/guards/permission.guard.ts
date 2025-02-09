import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../decorators/permission.decorator';
import { RequestWithSession } from '@/auth/jwt.strategy';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get(Permission, context.getHandler());
    if (!permission) {
      return true;
    }

    const request: RequestWithSession = context.switchToHttp().getRequest();
    const user = request.user?.data;

    if (!user) {
      return false;
    }

    return user.role.permissions.includes(permission);
  }
}
