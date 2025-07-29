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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostFilterDto } from './dto/post-filter.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '게시글이 성공적으로 생성되었습니다.',
    type: ResponseDto<PostResponseDto>,
  })
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
  ): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.create(createPostDto, req.user.userId);
    return new ResponseDto(post, '게시글이 성공적으로 생성되었습니다.');
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수' })
  @ApiQuery({ name: 'search', required: false, description: '검색 키워드' })
  @ApiQuery({ name: 'status', required: false, description: '게시글 상태' })
  @ApiQuery({ name: 'categoryId', required: false, description: '카테고리 ID' })
  @ApiQuery({ name: 'authorId', required: false, description: '작성자 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 목록이 성공적으로 조회되었습니다.',
    type: ResponseDto<PaginatedResponseDto<PostResponseDto>>,
  })
  async findAll(
    @Query() filterDto: PostFilterDto,
  ): Promise<ResponseDto<PaginatedResponseDto<PostResponseDto>>> {
    const posts = await this.postsService.findAll(filterDto);
    return new ResponseDto(posts, '게시글 목록이 성공적으로 조회되었습니다.');
  }

  @Get('slug/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '슬러그로 게시글 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글이 성공적으로 조회되었습니다.',
    type: ResponseDto<PostResponseDto>,
  })
  async findBySlug(@Param('slug') slug: string): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.findBySlug(slug);
    return new ResponseDto(post, '게시글이 성공적으로 조회되었습니다.');
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글이 성공적으로 조회되었습니다.',
    type: ResponseDto<PostResponseDto>,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.findOne(id);
    return new ResponseDto(post, '게시글이 성공적으로 조회되었습니다.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 수정' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글이 성공적으로 수정되었습니다.',
    type: ResponseDto<PostResponseDto>,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.update(id, updatePostDto);
    return new ResponseDto(post, '게시글이 성공적으로 수정되었습니다.');
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 발행' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글이 성공적으로 발행되었습니다.',
    type: ResponseDto<PostResponseDto>,
  })
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.publish(id);
    return new ResponseDto(post, '게시글이 성공적으로 발행되었습니다.');
  }

  @Post(':id/draft')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 임시저장' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글이 성공적으로 임시저장되었습니다.',
    type: ResponseDto<PostResponseDto>,
  })
  async draft(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.draft(id);
    return new ResponseDto(post, '게시글이 성공적으로 임시저장되었습니다.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글이 성공적으로 삭제되었습니다.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ResponseDto<null>> {
    await this.postsService.remove(id);
    return new ResponseDto(null, '게시글이 성공적으로 삭제되었습니다.');
  }
} 