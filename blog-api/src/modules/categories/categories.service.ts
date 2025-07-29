import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: TreeRepository<Category>,
  ) {}

  /**
   * 모든 카테고리 조회 (계층형 구조)
   */
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findTrees();
    return categories.map(category => this.mapToResponseDto(category));
  }

  /**
   * 카테고리 목록 조회 (페이지네이션)
   */
  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const { page, limit, skip } = paginationDto;

    const [categories, total] = await this.categoriesRepository.findAndCount({
      skip,
      take: limit,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    const categoryResponseDtos = categories.map(category => 
      this.mapToResponseDto(category)
    );

    return new PaginatedResponseDto(categoryResponseDtos, total, page || 1, limit || 10);
  }

  /**
   * 카테고리 상세 조회
   */
  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    return this.mapToResponseDto(category);
  }

  /**
   * 슬러그로 카테고리 조회
   */
  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    return this.mapToResponseDto(category);
  }

  /**
   * 카테고리 생성
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // 슬러그 중복 검사
    if (createCategoryDto.slug) {
      await this.checkSlugDuplicate(createCategoryDto.slug);
    }

    // 상위 카테고리 확인
    let parent: Category | null = null;
    if (createCategoryDto.parentId) {
      parent = await this.categoriesRepository.findOne({ 
        where: { id: createCategoryDto.parentId } 
      });
      if (!parent) {
        throw new NotFoundException('상위 카테고리를 찾을 수 없습니다.');
      }
    }

    // 슬러그 자동 생성 (제공되지 않은 경우)
    let slug = createCategoryDto.slug;
    if (!slug) {
      slug = this.generateSlug(createCategoryDto.name);
    }

    // 카테고리 생성
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      slug,
      parent: parent || undefined,
    });

    const savedCategory = await this.categoriesRepository.save(category);

    // 관계 데이터와 함께 조회
    const categoryWithRelations = await this.categoriesRepository.findOne({
      where: { id: savedCategory.id },
      relations: ['parent', 'children'],
    });

    return this.mapToResponseDto(categoryWithRelations!);
  }

  /**
   * 카테고리 수정
   */
  async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.findOne(id);

    // 슬러그 중복 검사 (변경된 경우)
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      await this.checkSlugDuplicate(updateCategoryDto.slug);
    }

    // 상위 카테고리 확인 (변경된 경우)
    if (updateCategoryDto.parentId && updateCategoryDto.parentId !== category.parent?.id) {
      const parent = await this.categoriesRepository.findOne({ 
        where: { id: updateCategoryDto.parentId } 
      });
      if (!parent) {
        throw new NotFoundException('상위 카테고리를 찾을 수 없습니다.');
      }
      category.parent = parent;
    }

    // 슬러그 자동 생성 (이름이 변경되고 슬러그가 제공되지 않은 경우)
    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      updateCategoryDto.slug = this.generateSlug(updateCategoryDto.name);
    }

    // 카테고리 업데이트
    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoriesRepository.save(category);

    // 관계 데이터와 함께 조회
    const categoryWithRelations = await this.categoriesRepository.findOne({
      where: { id: updatedCategory.id },
      relations: ['parent', 'children'],
    });

    return this.mapToResponseDto(categoryWithRelations!);
  }

  /**
   * 카테고리 삭제
   */
  async remove(id: number): Promise<void> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }
    
    // 하위 카테고리가 있는지 확인
    const children = await this.categoriesRepository.findDescendants(category);
    if (children.length > 1) { // 자기 자신 제외
      throw new ConflictException('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다.');
    }

    await this.categoriesRepository.remove(category);
  }

  /**
   * 하위 카테고리 조회
   */
  async findChildren(id: number): Promise<CategoryResponseDto[]> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    const children = await this.categoriesRepository.findDescendants(category);
    return children
      .filter(child => child.id !== id) // 자기 자신 제외
      .map(child => this.mapToResponseDto(child));
  }

  /**
   * 상위 카테고리 조회
   */
  async findAncestors(id: number): Promise<CategoryResponseDto[]> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    const ancestors = await this.categoriesRepository.findAncestors(category);
    return ancestors
      .filter(ancestor => ancestor.id !== id) // 자기 자신 제외
      .map(ancestor => this.mapToResponseDto(ancestor));
  }

  /**
   * 루트 카테고리 조회
   */
  async findRoots(): Promise<CategoryResponseDto[]> {
    const roots = await this.categoriesRepository.findRoots();
    return roots.map(root => this.mapToResponseDto(root));
  }

  // Private 메서드들

  /**
   * 응답 DTO로 변환
   */
  private mapToResponseDto(category: Category): CategoryResponseDto {
    return new CategoryResponseDto({
      ...category,
      parent: category.parent ? this.mapToResponseDto(category.parent) : undefined,
      children: category.children ? category.children.map(child => this.mapToResponseDto(child)) : undefined,
    });
  }

  /**
   * 슬러그 중복 검사
   */
  private async checkSlugDuplicate(slug: string): Promise<void> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException('이미 사용 중인 슬러그입니다.');
    }
  }

  /**
   * 슬러그 생성
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
} 