import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../../database/entities/user.entity';
import { Roles } from './roles.decorator';

export function Auth(...roles: UserRole[]) {
  const decorators = [UseGuards(JwtAuthGuard, RolesGuard)];
  
  if (roles.length > 0) {
    decorators.push(Roles(...roles));
  }
  
  return applyDecorators(...decorators);
} 