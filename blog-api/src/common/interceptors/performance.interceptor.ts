import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = process.hrtime.bigint();

    return next.handle().pipe(
      tap(() => {
        const endTime = process.hrtime.bigint();
        const executionTime = Number(endTime - startTime) / 1000000; // 밀리초로 변환

        // 느린 요청 경고 (1초 이상)
        if (executionTime > 1000) {
          this.logger.warn(`Slow request: ${method} ${url} - ${executionTime.toFixed(2)}ms`);
        } else {
          this.logger.log(`${method} ${url} - ${executionTime.toFixed(2)}ms`);
        }
      }),
    );
  }
} 