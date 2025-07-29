import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: '카테고리 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '카테고리 이름', example: '기술' })
  name: string;

  @ApiProperty({ description: '슬러그', example: 'technology' })
  slug: string;

  @ApiPropertyOptional({ description: '설명', example: '기술 관련 게시글들' })
  description?: string;

  @ApiProperty({ description: '정렬 순서', example: 0 })
  sortOrder: number;

  @ApiProperty({ description: '활성 상태', example: true })
  isActive: boolean;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: '상위 카테고리', type: CategoryResponseDto })
  parent?: CategoryResponseDto;

  @ApiPropertyOptional({ description: '하위 카테고리 목록', type: [CategoryResponseDto] })
  children?: CategoryResponseDto[];

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
} 