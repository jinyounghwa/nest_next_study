import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsNumber,
  IsPositive,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PostStatus } from '../../../database/entities/post.entity';

export class CreatePostDto {
  @ApiProperty({
    description: '게시글 제목',
    minLength: 1,
    maxLength: 200,
    example: '첫 번째 블로그 포스트',
  })
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
  @MaxLength(200, { message: '제목은 최대 200자까지 가능합니다.' })
  title: string;

  @ApiPropertyOptional({
    description: 'URL 슬러그 (자동 생성 가능)',
    maxLength: 250,
    example: 'my-first-blog-post',
  })
  @IsOptional()
  @IsString({ message: '슬러그는 문자열이어야 합니다.' })
  @MaxLength(250, { message: '슬러그는 최대 250자까지 가능합니다.' })
  @Matches(/^[a-z0-9-]+$/, {
    message: '슬러그는 소문자, 숫자, 하이픈만 사용 가능합니다.',
  })
  @Transform(({ value }) => value?.toLowerCase().replace(/\s+/g, '-'))
  slug?: string;

  @ApiProperty({
    description: '게시글 내용',
    minLength: 1,
    example: '이것은 첫 번째 블로그 포스트의 내용입니다.',
  })
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @MinLength(1, { message: '내용은 최소 1자 이상이어야 합니다.' })
  content: string;

  @ApiPropertyOptional({
    description: '게시글 요약',
    maxLength: 500,
    example: '첫 번째 포스트에 대한 간단한 요약입니다.',
  })
  @IsOptional()
  @IsString({ message: '요약은 문자열이어야 합니다.' })
  @MaxLength(500, { message: '요약은 최대 500자까지 가능합니다.' })
  excerpt?: string;

  @ApiPropertyOptional({
    description: '게시글 상태',
    enum: PostStatus,
    example: PostStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(PostStatus, { message: '올바른 게시글 상태가 아닙니다.' })
  status?: PostStatus;

  @ApiPropertyOptional({
    description: '카테고리 ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: '카테고리 ID는 숫자여야 합니다.' })
  @IsPositive({ message: '카테고리 ID는 양수여야 합니다.' })
  categoryId?: number;
} 