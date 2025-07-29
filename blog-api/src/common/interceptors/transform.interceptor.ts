import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // 이미 ResponseDto 형태라면 그대로 반환
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // 그렇지 않다면 ResponseDto로 래핑
        return new ResponseDto(data);
      }),
    );
  }
} 