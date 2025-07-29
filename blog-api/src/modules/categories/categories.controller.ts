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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 생성 (관리자/모더레이터만)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '카테고리가 성공적으로 생성되었습니다.',
    type: ResponseDto<CategoryResponseDto>,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.create(createCategoryDto);
    return new ResponseDto(category, '카테고리가 성공적으로 생성되었습니다.');
  }

  @Get()
  @ApiOperation({ summary: '카테고리 목록 조회 (계층형 구조)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리 목록이 성공적으로 조회되었습니다.',
    type: ResponseDto<CategoryResponseDto[]>,
  })
  async findAll(): Promise<ResponseDto<CategoryResponseDto[]>> {
    const categories = await this.categoriesService.findAll();
    return new ResponseDto(categories, '카테고리 목록이 성공적으로 조회되었습니다.');
  }

  @Get('paginated')
  @ApiOperation({ summary: '카테고리 목록 조회 (페이지네이션)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리 목록이 성공적으로 조회되었습니다.',
    type: ResponseDto<PaginatedResponseDto<CategoryResponseDto>>,
  })
  async findAllPaginated(
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseDto<PaginatedResponseDto<CategoryResponseDto>>> {
    const categories = await this.categoriesService.findAllPaginated(paginationDto);
    return new ResponseDto(categories, '카테고리 목록이 성공적으로 조회되었습니다.');
  }

  @Get('roots')
  @ApiOperation({ summary: '루트 카테고리 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '루트 카테고리가 성공적으로 조회되었습니다.',
    type: ResponseDto<CategoryResponseDto[]>,
  })
  async findRoots(): Promise<ResponseDto<CategoryResponseDto[]>> {
    const roots = await this.categoriesService.findRoots();
    return new ResponseDto(roots, '루트 카테고리가 성공적으로 조회되었습니다.');
  }

  @Get(':id')
  @ApiOperation({ summary: '카테고리 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리가 성공적으로 조회되었습니다.',
    type: ResponseDto<CategoryResponseDto>,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.findOne(id);
    return new ResponseDto(category, '카테고리가 성공적으로 조회되었습니다.');
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '슬러그로 카테고리 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리가 성공적으로 조회되었습니다.',
    type: ResponseDto<CategoryResponseDto>,
  })
  async findBySlug(@Param('slug') slug: string): Promise<ResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.findBySlug(slug);
    return new ResponseDto(category, '카테고리가 성공적으로 조회되었습니다.');
  }

  @Get(':id/children')
  @ApiOperation({ summary: '하위 카테고리 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '하위 카테고리가 성공적으로 조회되었습니다.',
    type: ResponseDto<CategoryResponseDto[]>,
  })
  async findChildren(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<CategoryResponseDto[]>> {
    const children = await this.categoriesService.findChildren(id);
    return new ResponseDto(children, '하위 카테고리가 성공적으로 조회되었습니다.');
  }

  @Get(':id/ancestors')
  @ApiOperation({ summary: '상위 카테고리 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '상위 카테고리가 성공적으로 조회되었습니다.',
    type: ResponseDto<CategoryResponseDto[]>,
  })
  async findAncestors(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<CategoryResponseDto[]>> {
    const ancestors = await this.categoriesService.findAncestors(id);
    return new ResponseDto(ancestors, '상위 카테고리가 성공적으로 조회되었습니다.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 수정 (관리자/모더레이터만)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리가 성공적으로 수정되었습니다.',
    type: ResponseDto<CategoryResponseDto>,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: CreateCategoryDto,
  ): Promise<ResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return new ResponseDto(category, '카테고리가 성공적으로 수정되었습니다.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 삭제 (관리자만)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리가 성공적으로 삭제되었습니다.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
    await this.categoriesService.remove(id);
    return new ResponseDto(null, '카테고리가 성공적으로 삭제되었습니다.');
  }
} 