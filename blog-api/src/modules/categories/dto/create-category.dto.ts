import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    description: '카테고리 이름',
    minLength: 1,
    maxLength: 100,
    example: '기술',
  })
  @IsString({ message: '카테고리 이름은 문자열이어야 합니다.' })
  @MinLength(1, { message: '카테고리 이름은 최소 1자 이상이어야 합니다.' })
  @MaxLength(100, { message: '카테고리 이름은 최대 100자까지 가능합니다.' })
  name: string;

  @ApiPropertyOptional({
    description: 'URL 슬러그 (자동 생성 가능)',
    maxLength: 150,
    example: 'technology',
  })
  @IsOptional()
  @IsString({ message: '슬러그는 문자열이어야 합니다.' })
  @MaxLength(150, { message: '슬러그는 최대 150자까지 가능합니다.' })
  @Matches(/^[a-z0-9-]+$/, {
    message: '슬러그는 소문자, 숫자, 하이픈만 사용 가능합니다.',
  })
  @Transform(({ value }) => value?.toLowerCase().replace(/\s+/g, '-'))
  slug?: string;

  @ApiPropertyOptional({
    description: '카테고리 설명',
    example: '기술 관련 게시글들',
  })
  @IsOptional()
  @IsString({ message: '설명은 문자열이어야 합니다.' })
  description?: string;

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: '정렬 순서는 숫자여야 합니다.' })
  sortOrder?: number;

  @ApiPropertyOptional({
    description: '상위 카테고리 ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: '상위 카테고리 ID는 숫자여야 합니다.' })
  @IsPositive({ message: '상위 카테고리 ID는 양수여야 합니다.' })
  parentId?: number;

  @ApiPropertyOptional({
    description: '활성 상태',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: '활성 상태는 불린 값이어야 합니다.' })
  isActive?: boolean;
} 