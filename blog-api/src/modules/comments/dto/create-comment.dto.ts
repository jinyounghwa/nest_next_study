import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    minLength: 1,
    maxLength: 1000,
    example: '좋은 게시글이네요!',
  })
  @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
  @MinLength(1, { message: '댓글 내용은 최소 1자 이상이어야 합니다.' })
  @MaxLength(1000, { message: '댓글 내용은 최대 1000자까지 가능합니다.' })
  content: string;

  @ApiProperty({
    description: '게시글 ID',
    example: 1,
  })
  @IsNumber({}, { message: '게시글 ID는 숫자여야 합니다.' })
  @IsPositive({ message: '게시글 ID는 양수여야 합니다.' })
  postId: number;

  @ApiPropertyOptional({
    description: '상위 댓글 ID (대댓글인 경우)',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: '상위 댓글 ID는 숫자여야 합니다.' })
  @IsPositive({ message: '상위 댓글 ID는 양수여야 합니다.' })
  parentId?: number;
} 