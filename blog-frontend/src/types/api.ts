// 사용자 관련 타입
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// 게시글 관련 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: PostStatus;
  publishedAt?: Date;
  viewCount: number;
  author: User;
  category?: Category;
  comments: Comment[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// 카테고리 관련 타입
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: Category;
  children?: Category[];
  posts: Post[];
  createdAt: Date;
  updatedAt: Date;
}

// 댓글 관련 타입
export interface Comment {
  id: number;
  content: string;
  status: CommentStatus;
  author: User;
  post: Post;
  parent?: Comment;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// 페이지네이션 타입
export interface PaginationDto {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

// 인증 관련 타입
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// 게시글 생성/수정 타입
export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  categoryId?: number;
  tags?: string[];
  status?: PostStatus;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  categoryId?: number;
  tags?: string[];
  status?: PostStatus;
}

// 댓글 생성/수정 타입
export interface CreateCommentRequest {
  content: string;
  postId: number;
  parentId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}

// 검색 및 필터 타입
export interface PostFilter {
  search?: string;
  categoryId?: number;
  authorId?: number;
  status?: PostStatus;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

// 통계 타입
export interface BlogStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalViews: number;
  recentPosts: Post[];
  popularPosts: Post[];
  activeUsers: User[];
} 