import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';

// 미들웨어
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

// 인터셉터
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';

// 필터
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

// 가드
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
// import { PostsModule } from './modules/posts/posts.module';
// import { CategoriesModule } from './modules/categories/categories.module';
// import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    // 환경 설정 모듈 (전역)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true, // 성능 향상을 위한 캐싱
    }),

    // 핵심 모듈들
    DatabaseModule,
    CommonModule,

    // 기능 모듈들
    AuthModule,
    UsersModule,
    // PostsModule,
    // CategoriesModule,
    // CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 전역 필터
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 전역 인터셉터
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 전역 가드
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        SecurityMiddleware,
        LoggerMiddleware,
      )
      .forRoutes('*'); // 모든 라우트에 적용
  }
}
