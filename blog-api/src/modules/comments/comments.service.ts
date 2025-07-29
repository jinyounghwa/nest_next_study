import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: TreeRepository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * 게시글의 댓글 목록 조회
   */
  async findByPostId(
    postId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    const { page, limit, skip } = paginationDto;

    // 게시글 확인
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 댓글 조회 (계층형 구조)
    const comments = await this.commentsRepository.find({
      where: { postId },
      relations: ['author', 'parent', 'replies'],
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    const total = await this.commentsRepository.count({ where: { postId } });

    const commentResponseDtos = comments.map(comment => 
      this.mapToResponseDto(comment)
    );

    return new PaginatedResponseDto(commentResponseDtos, total, page || 1, limit || 10);
  }

  /**
   * 댓글 상세 조회
   */
  async findOne(id: number): Promise<CommentResponseDto> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'parent', 'replies'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return this.mapToResponseDto(comment);
  }

  /**
   * 댓글 생성
   */
  async create(createCommentDto: CreateCommentDto, authorId: number): Promise<CommentResponseDto> {
    // 게시글 확인
    const post = await this.postsRepository.findOne({ 
      where: { id: createCommentDto.postId } 
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 작성자 확인
    const author = await this.usersRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException('작성자를 찾을 수 없습니다.');
    }

    // 상위 댓글 확인 (대댓글인 경우)
    let parent: Comment | null = null;
    if (createCommentDto.parentId) {
      parent = await this.commentsRepository.findOne({ 
        where: { id: createCommentDto.parentId, postId: createCommentDto.postId } 
      });
      if (!parent) {
        throw new NotFoundException('상위 댓글을 찾을 수 없습니다.');
      }
    }

    // 댓글 생성
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      authorId,
      isApproved: true, // 기본적으로 승인된 상태
    });

    const savedComment = await this.commentsRepository.save(comment);

    // 관계 데이터와 함께 조회
    const commentWithRelations = await this.commentsRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'post', 'parent'],
    });

    return this.mapToResponseDto(commentWithRelations!);
  }

  /**
   * 댓글 수정
   */
  async update(id: number, updateCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    const comment = await this.findOne(id);

    // 댓글 업데이트
    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentsRepository.save(comment);

    // 관계 데이터와 함께 조회
    const commentWithRelations = await this.commentsRepository.findOne({
      where: { id: updatedComment.id },
      relations: ['author', 'post', 'parent'],
    });

    return this.mapToResponseDto(commentWithRelations!);
  }

  /**
   * 댓글 삭제
   */
  async remove(id: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    
    // 하위 댓글이 있는지 확인
    const replies = await this.commentsRepository.findDescendants(comment);
    if (replies.length > 1) { // 자기 자신 제외
      throw new ConflictException('하위 댓글이 있는 댓글은 삭제할 수 없습니다.');
    }

    await this.commentsRepository.remove(comment);
  }

  /**
   * 댓글 승인/거부
   */
  async approve(id: number, isApproved: boolean): Promise<CommentResponseDto> {
    const comment = await this.findOne(id);
    
    comment.isApproved = isApproved;
    const updatedComment = await this.commentsRepository.save(comment);

    return this.mapToResponseDto(updatedComment);
  }

  /**
   * 좋아요 수 증가
   */
  async incrementLikeCount(id: number): Promise<void> {
    await this.commentsRepository.increment({ id }, 'likeCount', 1);
  }

  /**
   * 좋아요 수 감소
   */
  async decrementLikeCount(id: number): Promise<void> {
    await this.commentsRepository.decrement({ id }, 'likeCount', 1);
  }

  /**
   * 하위 댓글 조회
   */
  async findReplies(id: number): Promise<CommentResponseDto[]> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const replies = await this.commentsRepository.findDescendants(comment);
    return replies
      .filter(reply => reply.id !== id) // 자기 자신 제외
      .map(reply => this.mapToResponseDto(reply));
  }

  /**
   * 승인된 댓글만 조회
   */
  async findApprovedByPostId(postId: number): Promise<CommentResponseDto[]> {
    const comments = await this.commentsRepository.find({
      where: { postId, isApproved: true },
      relations: ['author', 'parent', 'replies'],
      order: { createdAt: 'ASC' },
    });

    return comments.map(comment => this.mapToResponseDto(comment));
  }

  // Private 메서드들

  /**
   * 응답 DTO로 변환
   */
  private mapToResponseDto(comment: Comment): CommentResponseDto {
    return new CommentResponseDto({
      ...comment,
      author: comment.author ? new UserResponseDto(comment.author) : undefined,
      parent: comment.parent ? this.mapToResponseDto(comment.parent) : undefined,
      replies: comment.replies ? comment.replies.map(reply => this.mapToResponseDto(reply)) : undefined,
    });
  }
} 