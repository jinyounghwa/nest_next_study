import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 유효성 검사 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성 제거
      forbidNonWhitelisted: true, // 없는 속성 전송 시 에러
      transform: true, // 자동 타입 변환
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Swagger API 문서 설정
  const config = new DocumentBuilder()
    .setTitle('블로그 API')
    .setDescription(`
      ## 📝 블로그 시스템 API 문서
      
      ### 🔐 인증
      - JWT 토큰 기반 인증
      - Bearer 토큰을 Authorization 헤더에 포함
      
      ### 👥 사용자 관리
      - 회원가입, 로그인, 프로필 관리
      - 역할 기반 권한 제어 (ADMIN, USER)
      
      ### 📝 게시글 관리
      - 게시글 CRUD 작업
      - 카테고리별 분류
      - 검색 및 필터링
      
      ### 💬 댓글 시스템
      - 댓글 CRUD 작업
      - 대댓글 지원
      - 승인/거부 기능
      
      ### 📂 카테고리 관리
      - 계층형 카테고리 구조
      - 트리 형태 데이터 관리
      
      ### 🔍 기능
      - 페이지네이션
      - 검색 및 필터링
      - 파일 업로드
      - 실시간 알림
    `)
    .setVersion('1.0.0')
    .addTag('auth', '인증 관련 API')
    .addTag('users', '사용자 관리 API')
    .addTag('posts', '게시글 관리 API')
    .addTag('categories', '카테고리 관리 API')
    .addTag('comments', '댓글 관리 API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력하세요',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .addServer('http://localhost:3000', '개발 서버')
    .addServer('https://api.example.com', '프로덕션 서버')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Swagger UI 커스터마이징
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
    customSiteTitle: '블로그 API 문서',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🎉 애플리케이션이 http://localhost:${port} 에서 실행 중입니다.`);
  console.log(`📝 API 문서: http://localhost:${port}/api-docs`);
}

bootstrap();
