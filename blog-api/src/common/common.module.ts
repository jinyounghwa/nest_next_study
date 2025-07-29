import { Global, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

@Global() // 전역 모듈로 설정
@Module({
  providers: [
    // 전역 파이프
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // 전역 필터 (필요시 추가)
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    // 전역 인터셉터 (필요시 추가)
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
  ],
  exports: [], // 필요한 경우 서비스들을 export
})
export class CommonModule {} 