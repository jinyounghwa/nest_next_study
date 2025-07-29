import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: '페이지 번호',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: '페이지 번호는 1 이상이어야 합니다.' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: '페이지당 항목 수는 최소 1개입니다.' })
  @Max(100, { message: '페이지당 항목 수는 최대 100개입니다.' })
  limit?: number = 10;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 10);
  }
}

export class PaginatedResponseDto<T> {
  @ApiPropertyOptional({ description: '데이터 배열' })
  data: T[];

  @ApiPropertyOptional({ description: '총 항목 수', example: 100 })
  total: number;

  @ApiPropertyOptional({ description: '현재 페이지', example: 1 })
  page: number;

  @ApiPropertyOptional({ description: '페이지당 항목 수', example: 10 })
  limit: number;

  @ApiPropertyOptional({ description: '총 페이지 수', example: 10 })
  totalPages: number;

  @ApiPropertyOptional({ description: '다음 페이지 존재 여부', example: true })
  hasNext: boolean;

  @ApiPropertyOptional({ description: '이전 페이지 존재 여부', example: false })
  hasPrev: boolean;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
} 