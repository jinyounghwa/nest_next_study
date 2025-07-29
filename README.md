# 블로그 프로젝트 (NestJS + Next.js)

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS" />
  <span style="font-size: 2em; margin: 0 1em;">+</span>
  <img src="https://nextjs.org/static/favicon/favicon-32x32.png" width="120" alt="Next.js" />
</p>

## 📋 프로젝트 개요

이 프로젝트는 **NestJS** 백엔드 API와 **Next.js** 프론트엔드로 구성된 풀스택 블로그 플랫폼입니다. 최신 기술과 개발 경험을 공유하는 블로그 서비스를 제공합니다.

### 🎯 주요 기능

- 🔐 **사용자 인증**: JWT 기반 로그인/회원가입
- 📝 **게시글 관리**: CRUD 작업, 카테고리별 분류
- 💬 **댓글 시스템**: 게시글별 댓글 작성 및 관리
- 🏷️ **카테고리 관리**: 게시글 분류 및 관리
- 🌙 **다크모드**: 라이트/다크 테마 전환
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- 🛡️ **보안**: 가드, 인터셉터, 필터를 통한 보안 강화

## 🏗️ 프로젝트 구조

```
nest/
├── blog-api/          # NestJS 백엔드 API
│   ├── src/
│   │   ├── common/    # 공통 모듈 (가드, 인터셉터, 필터)
│   │   ├── config/    # 설정 파일
│   │   ├── database/  # 데이터베이스 관련
│   │   ├── modules/   # 기능별 모듈
│   │   └── main.ts    # 애플리케이션 진입점
│   ├── test/          # 테스트 파일
│   └── README.md      # 백엔드 문서
├── blog-frontend/     # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/       # Next.js App Router 페이지
│   │   ├── components/# 재사용 가능한 컴포넌트
│   │   ├── contexts/  # React Context
│   │   ├── lib/       # 유틸리티 함수
│   │   └── types/     # TypeScript 타입 정의
│   └── README.md      # 프론트엔드 문서
└── README.md          # 이 파일 (전체 프로젝트 문서)
```

## 🛠️ 기술 스택

### Backend (NestJS)

- **Framework**: NestJS, TypeScript
- **Database**: SQLite (개발용), PostgreSQL (프로덕션용)
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest

### Frontend (Next.js)

- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Build Tool**: Turbopack

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/jinyounghwa/nest_next_study.git
cd nest_next_study
```

### 2. 백엔드 설정 및 실행

```bash
# 백엔드 디렉토리로 이동
cd blog-api

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 설정을 추가하세요

# 개발 서버 실행
npm run start:dev
```

백엔드는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 3. 프론트엔드 설정 및 실행

```bash
# 새 터미널에서 프론트엔드 디렉토리로 이동
cd blog-frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 API URL을 설정하세요

# 개발 서버 실행
npm run dev
```

프론트엔드는 기본적으로 `http://localhost:3001`에서 실행됩니다.

## 📖 상세 문서

### 백엔드 API

- [백엔드 README](./blog-api/README.md) - NestJS API 서버 상세 문서
- [API 문서](http://localhost:3000/api) - Swagger API 문서 (서버 실행 후)

### 프론트엔드

- [프론트엔드 README](./blog-frontend/README.md) - Next.js 프론트엔드 상세 문서

## 🔧 환경 설정

### 백엔드 환경 변수

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

### 프론트엔드 환경 변수

```env
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# 환경 설정
NODE_ENV=development
```

## 🗄️ 데이터베이스

### 개발 환경 (SQLite)

- 기본적으로 SQLite를 사용하므로 별도의 데이터베이스 설정이 필요하지 않습니다
- 애플리케이션 실행 시 자동으로 `database.sqlite` 파일이 생성됩니다

### 프로덕션 환경 (PostgreSQL)

```bash
# PostgreSQL 설치 (macOS)
brew install postgresql

# PostgreSQL 시작
brew services start postgresql

# 데이터베이스 생성
createdb blog_db
```

## 🧪 테스트

### 백엔드 테스트

```bash
cd blog-api

# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

### 프론트엔드 테스트

```bash
cd blog-frontend

# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e
```

## 🚀 배포

### 백엔드 배포

```bash
cd blog-api

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

### 프론트엔드 배포

```bash
cd blog-frontend

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start
```

### Docker 배포

```bash
# 백엔드 Docker 빌드
cd blog-api
docker build -t blog-api .

# 프론트엔드 Docker 빌드
cd ../blog-frontend
docker build -t blog-frontend .
```

## 📱 주요 페이지

### 홈페이지 (`/`)

- 최신 게시글 목록
- 카테고리 소개
- 회원가입 유도 섹션

### 게시글 (`/posts`)

- 전체 게시글 목록
- 필터링 및 검색 기능
- 페이지네이션

### 카테고리 (`/categories`)

- 카테고리별 게시글 분류
- 카테고리별 게시글 수 표시

### 사용자 인증

- **로그인** (`/login`): 사용자 인증
- **회원가입** (`/register`): 새 계정 생성

### 소개 (`/about`)

- 블로그 소개
- 개발팀 정보

## 🔒 보안 기능

### 백엔드 보안

- **JWT 인증**: 토큰 기반 인증
- **가드**: 라우트 보호
- **인터셉터**: 요청/응답 처리
- **필터**: 예외 처리
- **CORS**: 크로스 오리진 설정

### 프론트엔드 보안

- **인증 상태 관리**: React Context
- **보호된 라우트**: 인증 필요 페이지
- **토큰 관리**: 자동 로그인 유지

## 🎨 UI/UX 특징

### 디자인 시스템

- **색상**: Primary (파란색 계열), Secondary (회색 계열)
- **타이포그래피**: Inter 폰트 사용
- **아이콘**: Heroicons 라이브러리

### 반응형 디자인

- **모바일 우선**: 모바일 디자인을 우선으로 설계
- **브레이크포인트**: Tailwind CSS의 기본 브레이크포인트 활용
- **다크모드**: 라이트/다크 테마 전환 지원

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

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

## 📄 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE) 하에 배포됩니다.

## 📞 문의 및 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/jinyounghwa/nest_next_study/issues)
- **백엔드 문서**: [API 문서](http://localhost:3000/api)
- **프론트엔드 문서**: [Next.js 문서](https://nextjs.org/docs)
- **개발자**: 블로그 개발팀

## 🙏 감사의 말

이 프로젝트는 다음 기술들을 사용하여 개발되었습니다:

- [NestJS](https://nestjs.com/) - 효율적이고 확장 가능한 서버 사이드 애플리케이션을 위한 프레임워크
- [Next.js](https://nextjs.org/) - React 기반의 풀스택 웹 프레임워크
- [TypeScript](https://www.typescriptlang.org/) - JavaScript의 정적 타입 지원
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크

---

**블로그 프로젝트** - 최신 기술과 개발 경험을 공유하는 블로그 플랫폼입니다.
