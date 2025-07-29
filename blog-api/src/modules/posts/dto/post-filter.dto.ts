import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../../../database/entities/post.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class PostFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: '검색 키워드',
    example: 'NestJS',
  })
  @IsOptional()
  @IsString({ message: '검색 키워드는 문자열이어야 합니다.' })
  search?: string;

  @ApiPropertyOptional({
    description: '게시글 상태',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(PostStatus, { message: '올바른 게시글 상태가 아닙니다.' })
  status?: PostStatus;

  @ApiPropertyOptional({
    description: '카테고리 ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '카테고리 ID는 숫자여야 합니다.' })
  @IsPositive({ message: '카테고리 ID는 양수여야 합니다.' })
  categoryId?: number;

  @ApiPropertyOptional({
    description: '작성자 ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '작성자 ID는 숫자여야 합니다.' })
  @IsPositive({ message: '작성자 ID는 양수여야 합니다.' })
  authorId?: number;
} 