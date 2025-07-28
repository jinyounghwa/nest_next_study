# 🛠️ 개발 도구 추천

## 📝 코드 에디터

### Visual Studio Code (권장)

- **다운로드**: https://code.visualstudio.com/
- **추천 확장 프로그램**:
  - NestJS Files: NestJS 파일 생성 도구
  - TypeScript Importer: 자동 import
  - Prettier: 코드 포맷팅
  - ESLint: 코드 품질 검사
  - Thunder Client: API 테스트
  - GitLens: Git 히스토리
  - Auto Rename Tag: HTML 태그 자동 수정
  - Path Intellisense: 경로 자동완성
  - Tailwind CSS IntelliSense: Tailwind CSS 지원

### WebStorm

- **다운로드**: https://www.jetbrains.com/webstorm/
- **장점**: 강력한 TypeScript 지원, 통합 디버깅

## 🗄️ 데이터베이스 관리 도구

### PostgreSQL

- **다운로드**: https://www.postgresql.org/
- **관리 도구**: pgAdmin (https://www.pgadmin.org/)

### MySQL

- **다운로드**: https://www.mysql.com/
- **관리 도구**: MySQL Workbench (https://www.mysql.com/products/workbench/)

### MongoDB

- **다운로드**: https://www.mongodb.com/
- **관리 도구**: MongoDB Compass

## 🔧 API 테스트 도구

### Postman

- **다운로드**: https://www.postman.com/
- **장점**: 강력한 API 테스트 기능, 팀 협업

### Insomnia

- **다운로드**: https://insomnia.rest/
- **장점**: 직관적인 UI, GraphQL 지원

### Thunder Client (VS Code 확장)

- **설치**: VS Code 확장 마켓플레이스
- **장점**: VS Code 내장, 가벼움

## 🐳 Docker 도구

### Docker Desktop

- **다운로드**: https://www.docker.com/products/docker-desktop/
- **용도**: 컨테이너화된 개발 환경

### Docker Compose

- **용도**: 다중 컨테이너 애플리케이션 관리

## 📊 모니터링 도구

### Redis Desktop Manager

- **용도**: Redis 데이터베이스 관리

### RedisInsight

- **다운로드**: https://redis.com/redis-enterprise/redis-insight/
- **용도**: Redis 시각화 및 관리

## 🔍 디버깅 도구

### Chrome DevTools

- **용도**: 웹 애플리케이션 디버깅

### VS Code Debugger

- **용도**: Node.js 애플리케이션 디버깅

## 📚 문서화 도구

### Swagger UI

- **용도**: API 문서 자동 생성

### Postman Collections

- **용도**: API 테스트 케이스 관리

## 🧪 테스트 도구

### Jest

- **설치**: `npm install --save-dev jest`
- **용도**: 단위 테스트, 통합 테스트

### Supertest

- **설치**: `npm install --save-dev supertest`
- **용도**: HTTP API 테스트

## 🔒 보안 도구

### OWASP ZAP

- **다운로드**: https://owasp.org/www-project-zap/
- **용도**: 웹 애플리케이션 보안 테스트

### Burp Suite

- **다운로드**: https://portswigger.net/burp
- **용도**: 웹 보안 테스트

## 📈 성능 도구

### Apache Bench (ab)

- **용도**: HTTP 성능 테스트

### Artillery

- **설치**: `npm install -g artillery`
- **용도**: 부하 테스트

### New Relic

- **용도**: 애플리케이션 성능 모니터링

## 🎯 설치 체크리스트

- [ ] Node.js 18.x 이상
- [ ] npm 또는 yarn
- [ ] NestJS CLI
- [ ] VS Code 또는 WebStorm
- [ ] PostgreSQL 또는 MySQL
- [ ] Postman 또는 Insomnia
- [ ] Docker Desktop (선택사항)
- [ ] Git

## 🚀 빠른 시작

```bash
# Node.js 버전 확인
node --version
npm --version

# NestJS CLI 설치
npm install -g @nestjs/cli

# 프로젝트 생성
nest new blog-api

# 개발 서버 실행
npm run start:dev
```
