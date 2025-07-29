import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: '사용자 생성 (회원가입)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '사용자가 성공적으로 생성되었습니다.',
    type: ResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 사용자명 또는 이메일입니다.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.usersService.create(createUserDto);
    return new ResponseDto(user, '사용자가 성공적으로 생성되었습니다.');
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 목록 조회 (관리자만)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 목록이 성공적으로 조회되었습니다.',
    type: ResponseDto<PaginatedResponseDto<UserResponseDto>>,
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseDto<PaginatedResponseDto<UserResponseDto>>> {
    const users = await this.usersService.findAll(paginationDto);
    return new ResponseDto(users, '사용자 목록이 성공적으로 조회되었습니다.');
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '프로필이 성공적으로 조회되었습니다.',
    type: ResponseDto<UserResponseDto>,
  })
  async getProfile(@Request() req): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.usersService.findOne(req.user.userId);
    return new ResponseDto(user, '프로필이 성공적으로 조회되었습니다.');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 정보가 성공적으로 조회되었습니다.',
    type: ResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '사용자를 찾을 수 없습니다.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.usersService.findOne(id);
    return new ResponseDto(user, '사용자 정보가 성공적으로 조회되었습니다.');
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 수정' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '프로필이 성공적으로 수정되었습니다.',
    type: ResponseDto<UserResponseDto>,
  })
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.usersService.update(req.user.userId, updateUserDto);
    return new ResponseDto(user, '프로필이 성공적으로 수정되었습니다.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 수정 (관리자만)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 정보가 성공적으로 수정되었습니다.',
    type: ResponseDto<UserResponseDto>,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.usersService.update(id, updateUserDto);
    return new ResponseDto(user, '사용자 정보가 성공적으로 수정되었습니다.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 삭제 (관리자만)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자가 성공적으로 삭제되었습니다.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
    await this.usersService.remove(id);
    return new ResponseDto(null, '사용자가 성공적으로 삭제되었습니다.');
  }
} 