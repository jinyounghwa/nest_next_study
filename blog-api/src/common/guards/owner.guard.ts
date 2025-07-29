import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OWNER_KEY } from '../decorators/owner.decorator';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ownerField = this.reflector.get<string>(OWNER_KEY, context.getHandler());
    
    if (!ownerField) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resource = request.params;

    if (!user) {
      throw new ForbiddenException('사용자 정보를 찾을 수 없습니다.');
    }

    // 관리자는 모든 리소스에 접근 가능
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 소유자 확인
    const resourceOwnerId = resource[ownerField];
    if (resourceOwnerId && user.userId === parseInt(resourceOwnerId)) {
      return true;
    }

    throw new ForbiddenException('본인의 리소스에만 접근할 수 있습니다.');
  }
} 