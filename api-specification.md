# 📋 API 명세서

## 🔐 인증 (Authentication)

### 회원가입

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe"
}
```

**응답:**

```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 로그인

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**

```json
{
  "success": true,
  "message": "로그인이 완료되었습니다.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username"
    }
  }
}
```

### 로그아웃

```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

### 토큰 갱신

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 내 프로필 조회

```http
GET /auth/profile
Authorization: Bearer {accessToken}
```

## 👤 사용자 (Users)

### 사용자 목록 (관리자만)

```http
GET /users?page=1&limit=10&search=keyword
Authorization: Bearer {accessToken}
```

### 사용자 상세

```http
GET /users/:id
Authorization: Bearer {accessToken}
```

### 사용자 수정

```http
PUT /users/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "안녕하세요!"
}
```

### 사용자 삭제

```http
DELETE /users/:id
Authorization: Bearer {accessToken}
```

## 📝 게시글 (Posts)

### 게시글 목록

```http
GET /posts?page=1&limit=10&category=1&search=keyword&sort=latest
```

**응답:**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "첫 번째 게시글",
        "slug": "first-post",
        "excerpt": "게시글 요약...",
        "content": "게시글 내용...",
        "author": {
          "id": 1,
          "username": "username"
        },
        "category": {
          "id": 1,
          "name": "기술"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 게시글 생성

```http
POST /posts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "새로운 게시글",
  "content": "게시글 내용...",
  "categoryId": 1,
  "tags": ["기술", "NestJS"]
}
```

### 게시글 상세

```http
GET /posts/:id
```

### 게시글 수정

```http
PUT /posts/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "수정된 게시글",
  "content": "수정된 내용...",
  "categoryId": 1
}
```

### 게시글 삭제

```http
DELETE /posts/:id
Authorization: Bearer {accessToken}
```

### 슬러그로 게시글 조회

```http
GET /posts/slug/:slug
```

## 🏷️ 카테고리 (Categories)

### 카테고리 목록

```http
GET /categories
```

### 카테고리 생성

```http
POST /categories
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "기술",
  "description": "기술 관련 게시글",
  "parentId": null
}
```

### 카테고리 상세

```http
GET /categories/:id
```

### 카테고리 수정

```http
PUT /categories/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "개발",
  "description": "개발 관련 게시글"
}
```

### 카테고리 삭제

```http
DELETE /categories/:id
Authorization: Bearer {accessToken}
```

## 💬 댓글 (Comments)

### 게시글의 댓글 목록

```http
GET /posts/:postId/comments?page=1&limit=10&sort=latest
```

### 댓글 작성

```http
POST /posts/:postId/comments
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "좋은 게시글이네요!",
  "parentId": null
}
```

### 댓글 수정

```http
PUT /comments/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "수정된 댓글입니다."
}
```

### 댓글 삭제

```http
DELETE /comments/:id
Authorization: Bearer {accessToken}
```

### 대댓글 작성

```http
POST /comments/:id/reply
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "대댓글입니다."
}
```

## 🔧 공통 응답 형식

### 성공 응답

```json
{
  "success": true,
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    // 응답 데이터
  }
}
```

### 에러 응답

```json
{
  "success": false,
  "message": "에러 메시지",
  "error": {
    "code": "ERROR_CODE",
    "details": "상세 에러 정보"
  }
}
```

## 📊 상태 코드

- **200**: 성공
- **201**: 생성됨
- **400**: 잘못된 요청
- **401**: 인증 실패
- **403**: 권한 없음
- **404**: 리소스 없음
- **409**: 충돌
- **500**: 서버 에러

## 🔒 인증 헤더

모든 보호된 엔드포인트는 다음 헤더가 필요합니다:

```http
Authorization: Bearer {accessToken}
```
