import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class CommentResponseDto {
  @ApiProperty({ description: '댓글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '댓글 내용', example: '좋은 게시글이네요!' })
  content: string;

  @ApiProperty({ description: '승인 상태', example: true })
  isApproved: boolean;

  @ApiProperty({ description: '좋아요 수', example: 0 })
  likeCount: number;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;

  @ApiProperty({ description: '작성자 정보', type: UserResponseDto })
  author: UserResponseDto;

  @ApiProperty({ description: '게시글 ID', example: 1 })
  postId: number;

  @ApiPropertyOptional({ description: '상위 댓글', type: CommentResponseDto })
  parent?: CommentResponseDto;

  @ApiPropertyOptional({ description: '대댓글 목록', type: [CommentResponseDto] })
  replies?: CommentResponseDto[];

  constructor(partial: Partial<CommentResponseDto>) {
    Object.assign(this, partial);
  }
} 