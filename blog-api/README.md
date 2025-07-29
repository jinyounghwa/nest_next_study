# 블로그 API 서버

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 프로젝트 소개

이 프로젝트는 **NestJS**와 **TypeScript**를 사용하여 개발된 블로그 API 서버입니다. 사용자 인증, 게시글 관리, 댓글 시스템, 카테고리 관리 등의 기능을 제공합니다.

### 주요 기능

- 🔐 **사용자 인증**: JWT 기반 로그인/회원가입
- 📝 **게시글 관리**: CRUD 작업, 카테고리별 분류
- 💬 **댓글 시스템**: 게시글별 댓글 작성 및 관리
- 🏷️ **카테고리 관리**: 게시글 분류 및 관리
- 👥 **사용자 관리**: 프로필 관리, 권한 시스템
- 🛡️ **보안**: 가드, 인터셉터, 필터를 통한 보안 강화

### 기술 스택

- **Backend**: NestJS, TypeScript
- **Database**: SQLite (개발용), PostgreSQL (프로덕션용)
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest

## 프로젝트 구조

```
src/
├── common/           # 공통 모듈 (가드, 인터셉터, 필터 등)
├── config/           # 설정 파일 (데이터베이스 설정 포함)
├── database/         # 데이터베이스 관련 (엔티티, 마이그레이션)
├── modules/          # 기능별 모듈
│   ├── auth/         # 인증 모듈
│   ├── users/        # 사용자 관리
│   ├── posts/        # 게시글 관리
│   ├── comments/     # 댓글 관리
│   └── categories/   # 카테고리 관리
└── main.ts          # 애플리케이션 진입점
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 데이터베이스 설정 (개발용: SQLite, 프로덕션용: PostgreSQL)
DB_TYPE=sqlite
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

# SQLite 설정 (개발용)
DB_DATABASE=./database.sqlite

# JWT 설정
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# 서버 설정
PORT=3000
NODE_ENV=development
```

### 3. 데이터베이스 설정

#### 개발 환경 (SQLite)

기본적으로 SQLite를 사용하므로 별도의 데이터베이스 설정이 필요하지 않습니다. 애플리케이션 실행 시 자동으로 `database.sqlite` 파일이 생성됩니다.

#### 프로덕션 환경 (PostgreSQL)

PostgreSQL을 사용하려면 다음 단계를 따르세요:

1. PostgreSQL 데이터베이스 생성
2. 환경 변수에서 `DB_TYPE=postgres`로 설정
3. 데이터베이스 연결 정보 업데이트

```bash
# PostgreSQL 설치 (macOS)
brew install postgresql

# PostgreSQL 시작
brew services start postgresql

# 데이터베이스 생성
createdb blog_db
```

### 4. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start:prod

# 디버그 모드
npm run start:debug
```

## API 문서

애플리케이션 실행 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:

- **개발 환경**: http://localhost:3000/api
- **프로덕션 환경**: https://your-domain.com/api

## 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov

# 테스트 감시 모드
npm run test:watch
```

## 배포

### Docker를 사용한 배포

```bash
# Docker 이미지 빌드
docker build -t blog-api .

# 컨테이너 실행 (SQLite 사용)
docker run -p 3000:3000 blog-api

# 컨테이너 실행 (PostgreSQL 사용)
docker run -p 3000:3000 -e DB_TYPE=postgres -e DB_HOST=your-db-host blog-api
```

### 클라우드 배포

AWS, Google Cloud, Azure 등의 클라우드 플랫폼에 배포할 수 있습니다.

#### 환경별 데이터베이스 설정

- **개발 환경**: SQLite (파일 기반, 설정 불필요)
- **스테이징 환경**: PostgreSQL (로컬 또는 클라우드)
- **프로덕션 환경**: PostgreSQL (관리형 서비스 권장)

## 개발 가이드

### 코드 스타일

- **ESLint**와 **Prettier**를 사용하여 코드 스타일을 통일합니다
- **TypeScript**의 엄격한 타입 체크를 활용합니다
- **NestJS**의 아키텍처 패턴을 따릅니다

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE) 하에 배포됩니다.

## 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 문의 및 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/your-username/blog-api/issues)
- **문서**: [API 문서](http://localhost:3000/api)
- **개발자**: 블로그 개발팀

---

**블로그 API 서버** - 최신 기술과 개발 경험을 공유하는 블로그 플랫폼의 백엔드 서버입니다.
