import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../../../database/entities/post.entity';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class PostResponseDto {
  @ApiProperty({ description: '게시글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '제목', example: '첫 번째 블로그 포스트' })
  title: string;

  @ApiProperty({ description: '슬러그', example: 'my-first-blog-post' })
  slug: string;

  @ApiProperty({ description: '내용', example: '게시글 내용입니다.' })
  content: string;

  @ApiPropertyOptional({ description: '요약', example: '게시글 요약입니다.' })
  excerpt?: string;

  @ApiPropertyOptional({ description: '대표 이미지' })
  featuredImage?: string;

  @ApiProperty({ description: '상태', enum: PostStatus, example: PostStatus.PUBLISHED })
  status: PostStatus;

  @ApiProperty({ description: '조회 수', example: 0 })
  viewCount: number;

  @ApiProperty({ description: '좋아요 수', example: 0 })
  likeCount: number;

  @ApiProperty({ description: '댓글 수', example: 0 })
  commentCount: number;

  @ApiPropertyOptional({ description: '발행일시' })
  publishedAt?: Date;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;

  @ApiProperty({ description: '작성자 정보', type: UserResponseDto })
  author: UserResponseDto;

  @ApiPropertyOptional({ description: '카테고리 정보', type: CategoryResponseDto })
  category?: CategoryResponseDto;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
} 