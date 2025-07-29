import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Public 데코레이터가 있는 경우 인증 건너뛰기
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const errorMessage = this.getErrorMessage(info);
      
      throw err || new UnauthorizedException({
        message: errorMessage,
        statusCode: 401,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
    
    return user;
  }

  private getErrorMessage(info: any): string {
    if (info?.name === 'TokenExpiredError') {
      return '토큰이 만료되었습니다. 다시 로그인해주세요.';
    }
    
    if (info?.name === 'JsonWebTokenError') {
      return '유효하지 않은 토큰입니다.';
    }
    
    if (info?.name === 'NotBeforeError') {
      return '토큰이 아직 활성화되지 않았습니다.';
    }
    
    return '인증이 필요합니다.';
  }
} 