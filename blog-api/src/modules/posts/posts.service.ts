import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post, PostStatus } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { Category } from '../../database/entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostFilterDto } from './dto/post-filter.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  /**
   * 게시글 목록 조회 (필터링 포함)
   */
  async findAll(filterDto: PostFilterDto): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { page, limit, skip, search, status, categoryId, authorId } = filterDto;

    // 쿼리 빌더 생성
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.comments', 'comments');

    // 검색 조건 추가
    if (search) {
      queryBuilder.andWhere(
        '(post.title LIKE :search OR post.content LIKE :search OR post.excerpt LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 상태 필터
    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    // 카테고리 필터
    if (categoryId) {
      queryBuilder.andWhere('post.categoryId = :categoryId', { categoryId });
    }

    // 작성자 필터
    if (authorId) {
      queryBuilder.andWhere('post.authorId = :authorId', { authorId });
    }

    // 정렬 및 페이지네이션
    queryBuilder
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    // DTO 변환
    const postResponseDtos = posts.map(post => this.mapToResponseDto(post));

    return new PaginatedResponseDto(postResponseDtos, total, page || 1, limit || 10);
  }

  /**
   * 게시글 상세 조회
   */
  async findOne(id: number): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'comments'],
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.incrementViewCount(id);

    return this.mapToResponseDto(post);
  }

  /**
   * 슬러그로 게시글 조회
   */
  async findBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOne({
      where: { slug },
      relations: ['author', 'category', 'comments'],
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.incrementViewCount(post.id);

    return this.mapToResponseDto(post);
  }

  /**
   * 게시글 생성
   */
  async create(createPostDto: CreatePostDto, authorId: number): Promise<PostResponseDto> {
    // 작성자 확인
    const author = await this.usersRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException('작성자를 찾을 수 없습니다.');
    }

    // 카테고리 확인 (제공된 경우)
    let category: Category | null = null;
    if (createPostDto.categoryId) {
      category = await this.categoriesRepository.findOne({ 
        where: { id: createPostDto.categoryId } 
      });
      if (!category) {
        throw new NotFoundException('카테고리를 찾을 수 없습니다.');
      }
    }

    // 슬러그 자동 생성 (제공되지 않은 경우)
    let slug = createPostDto.slug;
    if (!slug) {
      slug = this.generateSlug(createPostDto.title);
    }

    // 게시글 생성
    const post = this.postsRepository.create({
      ...createPostDto,
      slug,
      authorId,
      status: createPostDto.status || PostStatus.DRAFT,
    });

    const savedPost = await this.postsRepository.save(post);

    // 관계 데이터와 함께 조회
    const postWithRelations = await this.postsRepository.findOne({
      where: { id: savedPost.id },
      relations: ['author', 'category'],
    });

    return this.mapToResponseDto(postWithRelations!);
  }

  /**
   * 게시글 수정
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.findOne(id);

    // 카테고리 확인 (제공된 경우)
    if (updatePostDto.categoryId) {
      const category = await this.categoriesRepository.findOne({ 
        where: { id: updatePostDto.categoryId } 
      });
      if (!category) {
        throw new NotFoundException('카테고리를 찾을 수 없습니다.');
      }
    }

    // 슬러그 자동 생성 (제목이 변경되고 슬러그가 제공되지 않은 경우)
    if (updatePostDto.title && !updatePostDto.slug) {
      updatePostDto.slug = this.generateSlug(updatePostDto.title);
    }

    // 게시글 업데이트
    Object.assign(post, updatePostDto);
    const updatedPost = await this.postsRepository.save(post);

    // 관계 데이터와 함께 조회
    const postWithRelations = await this.postsRepository.findOne({
      where: { id: updatedPost.id },
      relations: ['author', 'category'],
    });

    return this.mapToResponseDto(postWithRelations!);
  }

  /**
   * 게시글 삭제
   */
  async remove(id: number): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    await this.postsRepository.remove(post);
  }

  /**
   * 조회수 증가
   */
  async incrementViewCount(id: number): Promise<void> {
    await this.postsRepository.increment({ id }, 'viewCount', 1);
  }

  /**
   * 좋아요 수 증가
   */
  async incrementLikeCount(id: number): Promise<void> {
    await this.postsRepository.increment({ id }, 'likeCount', 1);
  }

  /**
   * 좋아요 수 감소
   */
  async decrementLikeCount(id: number): Promise<void> {
    await this.postsRepository.decrement({ id }, 'likeCount', 1);
  }

  /**
   * 게시글 발행
   */
  async publish(id: number): Promise<PostResponseDto> {
    const post = await this.findOne(id);
    
    post.status = PostStatus.PUBLISHED;
    post.publishedAt = new Date();
    
    const updatedPost = await this.postsRepository.save(post);
    
    return this.mapToResponseDto(updatedPost);
  }

  /**
   * 게시글 임시저장
   */
  async draft(id: number): Promise<PostResponseDto> {
    const post = await this.findOne(id);
    
    post.status = PostStatus.DRAFT;
    post.publishedAt = undefined;
    
    const updatedPost = await this.postsRepository.save(post);
    
    return this.mapToResponseDto(updatedPost);
  }

  // Private 메서드들

  /**
   * 응답 DTO로 변환
   */
  private mapToResponseDto(post: Post): PostResponseDto {
    return new PostResponseDto({
      ...post,
      author: post.author ? new UserResponseDto(post.author) : undefined,
      category: post.category ? new CategoryResponseDto(post.category) : undefined,
    });
  }

  /**
   * 슬러그 생성
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
} 