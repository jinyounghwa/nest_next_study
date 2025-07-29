import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // XSS 방어
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');

    // HTTPS 강제 (프로덕션 환경)
    if (process.env.NODE_ENV === 'production') {
      res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // 서버 정보 숨기기
    res.removeHeader('X-Powered-By');

    // CSP 헤더
    res.header(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
    );

    next();
  }
} 