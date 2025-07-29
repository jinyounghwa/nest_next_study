import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../../../database/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '사용자명', example: 'john_doe' })
  username: string;

  @ApiProperty({ description: '이메일', example: 'john@example.com' })
  email: string;

  @ApiPropertyOptional({ description: '이름', example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ description: '성', example: 'Doe' })
  lastName?: string;

  @ApiProperty({ description: '전체 이름', example: 'John Doe' })
  @Expose()
  fullName: string;

  @ApiProperty({ description: '사용자 역할', enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: '활성 상태', example: true })
  isActive: boolean;

  @ApiProperty({ description: '이메일 인증 여부', example: false })
  emailVerified: boolean;

  @ApiPropertyOptional({ description: '마지막 로그인 시간' })
  lastLoginAt?: Date;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
} 