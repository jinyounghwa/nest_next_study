import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인이 성공적으로 완료되었습니다.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: { $ref: '#/components/schemas/UserResponseDto' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 정보가 올바르지 않습니다.',
  })
  async login(@Request() req): Promise<ResponseDto<any>> {
    const result = await this.authService.login(req.user);
    return new ResponseDto(result, '로그인이 성공적으로 완료되었습니다.');
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '회원가입이 성공적으로 완료되었습니다.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: { $ref: '#/components/schemas/UserResponseDto' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 사용자명 또는 이메일입니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '입력 데이터가 올바르지 않습니다.',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<any>> {
    // 사용자 생성
    const user = await this.usersService.create(createUserDto);
    
    // 로그인 처리 (토큰 생성)
    const result = await this.authService.login(user);
    
    return new ResponseDto(result, '회원가입이 성공적으로 완료되었습니다.');
  }
} 