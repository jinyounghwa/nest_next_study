import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../../database/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자명',
    minLength: 3,
    maxLength: 20,
    example: 'john_doe',
  })
  @IsString({ message: '사용자명은 문자열이어야 합니다.' })
  @MinLength(3, { message: '사용자명은 최소 3자 이상이어야 합니다.' })
  @MaxLength(20, { message: '사용자명은 최대 20자까지 가능합니다.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.',
  })
  username: string;

  @ApiProperty({
    description: '이메일 주소',
    format: 'email',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @MaxLength(100, { message: '이메일은 최대 100자까지 가능합니다.' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    minLength: 8,
    maxLength: 50,
    example: 'Password123!',
  })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(50, { message: '비밀번호는 최대 50자까지 가능합니다.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: '비밀번호는 대소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
    },
  )
  password: string;

  @ApiPropertyOptional({
    description: '이름',
    maxLength: 50,
    example: 'John',
  })
  @IsOptional()
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @MaxLength(50, { message: '이름은 최대 50자까지 가능합니다.' })
  firstName?: string;

  @ApiPropertyOptional({
    description: '성',
    maxLength: 50,
    example: 'Doe',
  })
  @IsOptional()
  @IsString({ message: '성은 문자열이어야 합니다.' })
  @MaxLength(50, { message: '성은 최대 50자까지 가능합니다.' })
  lastName?: string;

  @ApiPropertyOptional({
    description: '사용자 역할',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: '올바른 사용자 역할이 아닙니다.' })
  role?: UserRole;
} 