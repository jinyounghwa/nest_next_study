# 블로그 프론트엔드

이 프로젝트는 [Next.js](https://nextjs.org)를 사용하여 개발된 블로그 프론트엔드 애플리케이션입니다. 최신 기술과 개발 경험을 공유하는 블로그 플랫폼의 사용자 인터페이스를 제공합니다.

## 프로젝트 소개

### 주요 기능

- 🏠 **홈페이지**: 최신 게시글과 카테고리 소개
- 📝 **게시글 관리**: 게시글 목록, 상세보기, 작성
- 🏷️ **카테고리**: 주제별 게시글 분류 및 탐색
- 👤 **사용자 인증**: 로그인, 회원가입, 프로필 관리
- 🌙 **다크모드**: 라이트/다크 테마 전환
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

### 기술 스택

- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Build Tool**: Turbopack

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
│   ├── about/        # 소개 페이지
│   ├── categories/   # 카테고리 페이지
│   ├── login/        # 로그인 페이지
│   ├── posts/        # 게시글 페이지
│   ├── register/     # 회원가입 페이지
│   └── layout.tsx    # 루트 레이아웃
├── components/       # 재사용 가능한 컴포넌트
│   └── layout/       # 레이아웃 컴포넌트
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Layout.tsx
├── contexts/         # React Context
│   └── AuthContext.tsx
├── lib/              # 유틸리티 함수
│   └── api.ts
└── types/            # TypeScript 타입 정의
    └── api.ts
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# 환경 설정
NODE_ENV=development
```

### 3. 개발 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

브라우저에서 [http://localhost:3001](http://localhost:3001)을 열어 결과를 확인하세요.

## 주요 페이지

### 🏠 홈페이지 (`/`)

- 최신 게시글 목록
- 카테고리 소개
- 회원가입 유도 섹션

### 📝 게시글 (`/posts`)

- 전체 게시글 목록
- 필터링 및 검색 기능
- 페이지네이션

### 🏷️ 카테고리 (`/categories`)

- 카테고리별 게시글 분류
- 카테고리별 게시글 수 표시

### 👤 사용자 인증

- **로그인** (`/login`): 사용자 인증
- **회원가입** (`/register`): 새 계정 생성

### ℹ️ 소개 (`/about`)

- 블로그 소개
- 개발팀 정보

## 컴포넌트 구조

### Layout 컴포넌트

- **Header**: 네비게이션, 다크모드 토글, 사용자 메뉴
- **Footer**: 링크, 저작권 정보
- **Layout**: 전체 레이아웃 관리, 다크모드 상태 관리

### 인증 시스템

- **AuthContext**: 전역 인증 상태 관리
- **JWT 토큰**: 자동 로그인 유지
- **가드**: 보호된 페이지 접근 제어

## 스타일링

### Tailwind CSS

- **커스텀 색상**: Primary, Secondary 색상 팔레트
- **다크모드**: `dark:` 클래스를 통한 테마 전환
- **반응형**: 모바일 우선 접근법

### 디자인 시스템

- **색상**: Primary (파란색 계열), Secondary (회색 계열)
- **타이포그래피**: Inter 폰트 사용
- **아이콘**: Heroicons 라이브러리

## 개발 가이드

### 코드 스타일

- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **TypeScript**: 엄격한 타입 체크

### 파일 명명 규칙

- **컴포넌트**: PascalCase (예: `Header.tsx`)
- **페이지**: kebab-case (예: `about/page.tsx`)
- **유틸리티**: camelCase (예: `api.ts`)

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

## 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Docker 배포

```dockerfile
# Dockerfile 예시
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 정적 사이트 생성

```bash
# 정적 사이트 빌드
npm run build
npm run export
```

## API 연동

### 백엔드 API

- **Base URL**: `http://localhost:3000`
- **인증**: JWT 토큰 기반
- **문서**: Swagger/OpenAPI

### 주요 API 엔드포인트

- `GET /api/posts` - 게시글 목록
- `GET /api/posts/:id` - 게시글 상세
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입

## 성능 최적화

### Next.js 최적화

- **App Router**: 서버 컴포넌트 활용
- **이미지 최적화**: `next/image` 사용
- **폰트 최적화**: `next/font` 사용
- **번들 최적화**: Turbopack 사용

### 성능 모니터링

- **Core Web Vitals** 측정
- **Lighthouse** 점수 모니터링
- **Bundle Analyzer** 활용

## 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
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

- **이슈 리포트**: [GitHub Issues](https://github.com/your-username/blog-frontend/issues)
- **문서**: [Next.js 문서](https://nextjs.org/docs)
- **개발자**: 블로그 개발팀

---

**블로그 프론트엔드** - 최신 기술과 개발 경험을 공유하는 블로그 플랫폼의 프론트엔드 애플리케이션입니다.
