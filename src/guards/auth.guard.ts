import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionGuard } from './permission.guard';
import { Permission } from '@/decorators/permission.decorator';

export function Auth(permission?: string) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PermissionGuard),
    permission ? Permission(permission) : () => {},
  );
}
