import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const requestId = request.id;

    const startTime = Date.now();

    this.logger.log(
      `[${requestId}] ${method} ${url} - Request: ${JSON.stringify({
        body: this.sanitizeBody(body),
        query,
        params,
      })}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        this.logger.log(
          `[${requestId}] ${method} ${url} - Response: ${responseTime}ms`,
        );
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        this.logger.error(
          `[${requestId}] ${method} ${url} - Error: ${error.message} - ${responseTime}ms`,
        );
        return throwError(() => error);
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };

    // 민감한 정보 마스킹
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });

    return sanitized;
  }
} 