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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '댓글이 성공적으로 생성되었습니다.',
    type: ResponseDto<CommentResponseDto>,
  })
  async create(
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.create(createCommentDto, req.user.userId);
    return new ResponseDto(comment, '댓글이 성공적으로 생성되었습니다.');
  }

  @Get('post/:postId')
  @ApiOperation({ summary: '게시글의 댓글 목록 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글 목록이 성공적으로 조회되었습니다.',
    type: ResponseDto<PaginatedResponseDto<CommentResponseDto>>,
  })
  async findByPostId(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseDto<PaginatedResponseDto<CommentResponseDto>>> {
    const comments = await this.commentsService.findByPostId(postId, paginationDto);
    return new ResponseDto(comments, '댓글 목록이 성공적으로 조회되었습니다.');
  }

  @Get('post/:postId/approved')
  @ApiOperation({ summary: '게시글의 승인된 댓글 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '승인된 댓글 목록이 성공적으로 조회되었습니다.',
    type: ResponseDto<CommentResponseDto[]>,
  })
  async findApprovedByPostId(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<ResponseDto<CommentResponseDto[]>> {
    const comments = await this.commentsService.findApprovedByPostId(postId);
    return new ResponseDto(comments, '승인된 댓글 목록이 성공적으로 조회되었습니다.');
  }

  @Get(':id')
  @ApiOperation({ summary: '댓글 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글이 성공적으로 조회되었습니다.',
    type: ResponseDto<CommentResponseDto>,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.findOne(id);
    return new ResponseDto(comment, '댓글이 성공적으로 조회되었습니다.');
  }

  @Get(':id/replies')
  @ApiOperation({ summary: '댓글의 대댓글 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '대댓글이 성공적으로 조회되었습니다.',
    type: ResponseDto<CommentResponseDto[]>,
  })
  async findReplies(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<CommentResponseDto[]>> {
    const replies = await this.commentsService.findReplies(id);
    return new ResponseDto(replies, '대댓글이 성공적으로 조회되었습니다.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 수정' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글이 성공적으로 수정되었습니다.',
    type: ResponseDto<CommentResponseDto>,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateCommentDto: CreateCommentDto,
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.update(id, updateCommentDto);
    return new ResponseDto(comment, '댓글이 성공적으로 수정되었습니다.');
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 승인 (관리자/모더레이터만)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글이 성공적으로 승인되었습니다.',
    type: ResponseDto<CommentResponseDto>,
  })
  async approve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.approve(id, true);
    return new ResponseDto(comment, '댓글이 성공적으로 승인되었습니다.');
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 거부 (관리자/모더레이터만)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글이 성공적으로 거부되었습니다.',
    type: ResponseDto<CommentResponseDto>,
  })
  async reject(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.approve(id, false);
    return new ResponseDto(comment, '댓글이 성공적으로 거부되었습니다.');
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 좋아요' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글 좋아요가 성공적으로 처리되었습니다.',
  })
  async like(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
    await this.commentsService.incrementLikeCount(id);
    return new ResponseDto(null, '댓글 좋아요가 성공적으로 처리되었습니다.');
  }

  @Post(':id/unlike')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 좋아요 취소' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글 좋아요 취소가 성공적으로 처리되었습니다.',
  })
  async unlike(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
    await this.commentsService.decrementLikeCount(id);
    return new ResponseDto(null, '댓글 좋아요 취소가 성공적으로 처리되었습니다.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글이 성공적으로 삭제되었습니다.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ResponseDto<null>> {
    await this.commentsService.remove(id);
    return new ResponseDto(null, '댓글이 성공적으로 삭제되었습니다.');
  }
} 