import { ConfigModule } from '@nestjs/config';

// 전역 테스트 설정
beforeAll(async () => {
  // 테스트 환경 변수 설정
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.DATABASE_URL = ':memory:';
});

// 각 테스트 후 정리
afterEach(async () => {
  // 모킹 초기화
  jest.clearAllMocks();
});

// 모든 테스트 완료 후 정리
afterAll(async () => {
  // 전역 정리 작업
}); 