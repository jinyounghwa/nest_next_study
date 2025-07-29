# 📊 ERD (개체 관계 다이어그램) 설계

## 🎯 블로그 시스템 데이터베이스 설계

### 주요 엔티티 및 관계

```
┌─────────────┐    1:N     ┌─────────────┐    N:1     ┌─────────────┐
│    User     │ ────────── │    Post     │ ────────── │  Category   │
├─────────────┤            ├─────────────┤            ├─────────────┤
│ id (PK)     │            │ id (PK)     │            │ id (PK)     │
│ username    │            │ title       │            │ name        │
│ email       │            │ content     │            │ slug        │
│ password    │            │ slug        │            │ description │
│ firstName   │            │ excerpt     │            │ parentId    │
│ lastName    │            │ published   │            │ createdAt   │
│ role        │            │ publishedAt │            │ updatedAt   │
│ isActive    │            │ authorId(FK)│            └─────────────┘
│ createdAt   │            │ categoryId  │
│ updatedAt   │            │ createdAt   │
└─────────────┘            │ updatedAt   │
                           └─────────────┘
                                 │
                                 │ 1:N
                                 ▼
                           ┌─────────────┐
                           │   Comment   │
                           ├─────────────┤
                           │ id (PK)     │
                           │ content     │
                           │ authorId(FK)│
                           │ postId (FK) │
                           │ parentId    │
                           │ isApproved  │
                           │ createdAt   │
                           │ updatedAt   │
                           └─────────────┘
```

## 🔗 관계 설명

### 1:N 관계

- **User ↔ Post**: 한 사용자가 여러 게시글 작성
- **Category ↔ Post**: 한 카테고리에 여러 게시글
- **Post ↔ Comment**: 한 게시글에 여러 댓글
- **User ↔ Comment**: 한 사용자가 여러 댓글 작성

### 계층형 관계

- **Category ↔ Category**: 계층형 카테고리 (부모-자식)
- **Comment ↔ Comment**: 대댓글 구조 (부모-자식)

### 관계 제약조건

- **CASCADE**: 사용자 삭제 시 게시글/댓글 삭제
- **SET NULL**: 카테고리 삭제 시 게시글 카테고리 NULL
- **UNIQUE**: 이메일, 사용자명, 슬러그 중복 방지

## 📋 엔티티 상세 설계

### User 엔티티

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role ENUM('admin', 'moderator', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Category 엔티티

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Post 엔티티

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  meta_title VARCHAR(255),
  meta_description TEXT,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Comment 엔티티

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 인덱스 설계

### 성능 최적화 인덱스

```sql
-- User 테이블
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Category 테이블
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Post 테이블
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- Comment 테이블
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

## 📊 데이터 무결성 규칙

### 제약조건

- **NOT NULL**: 필수 필드들
- **UNIQUE**: 이메일, 사용자명, 슬러그
- **FOREIGN KEY**: 관계 무결성 보장
- **CHECK**: 상태값 범위 제한

### 트리거 (선택사항)

- **댓글 수 자동 업데이트**: 게시글 댓글 수 자동 계산
- **조회수 자동 증가**: 게시글 조회 시 조회수 증가
- **수정일 자동 업데이트**: 레코드 수정 시 updated_at 자동 갱신

## 🚀 성능 최적화 전략

### 쿼리 최적화

- **인덱스 활용**: 자주 조회되는 컬럼에 인덱스 생성
- **페이지네이션**: 대용량 데이터 처리
- **조인 최적화**: 필요한 컬럼만 조회

### 캐싱 전략

- **Redis 캐싱**: 자주 조회되는 데이터 캐싱
- **쿼리 캐싱**: 반복 쿼리 결과 캐싱

### 확장성 고려사항

- **수평 분할**: 테이블별 분산 저장
- **수직 분할**: 컬럼별 분산 저장
- **읽기 전용 복제**: 읽기 부하 분산
