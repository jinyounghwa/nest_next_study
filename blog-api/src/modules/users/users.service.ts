import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * 사용자 목록 조회
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page, limit, skip } = paginationDto;

    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userResponseDtos = users.map(user => new UserResponseDto({
      ...user,
      fullName: user.fullName,
    }));

    return new PaginatedResponseDto(userResponseDtos, total, page || 1, limit || 10);
  }

  /**
   * 사용자 상세 조회
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return new UserResponseDto({
      ...user,
      fullName: user.fullName,
    });
  }

  /**
   * 사용자 생성
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // 중복 검사
    await this.checkDuplicateUser(createUserDto.username, createUserDto.email);

    // 비밀번호 해싱
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // 사용자 생성
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    });

    const savedUser = await this.usersRepository.save(user);

    return new UserResponseDto({
      ...savedUser,
      fullName: savedUser.fullName,
    });
  }

  /**
   * 사용자 수정
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    
    // 중복 검사 (변경된 필드만)
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      await this.checkUsernameDuplicate(updateUserDto.username);
    }
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.checkEmailDuplicate(updateUserDto.email);
    }

    // 사용자 업데이트
    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    return new UserResponseDto({
      ...updatedUser,
      fullName: updatedUser.fullName,
    });
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
    }

    // 새 비밀번호 해싱 및 업데이트
    const hashedNewPassword = await this.hashPassword(newPassword);
    await this.usersRepository.update(id, { password: hashedNewPassword });
  }

  /**
   * 사용자명으로 조회 (인증용)
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password', 'role', 'isActive'],
    });
  }

  /**
   * 이메일로 조회
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password', 'role', 'isActive'],
    });
  }

  // Private 메서드들

  /**
   * 중복 사용자 검사
   */
  private async checkDuplicateUser(
    username: string,
    email: string,
  ): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username },
        { email },
      ],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('이미 사용 중인 사용자명입니다.');
      }
      if (existingUser.email === email) {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }
    }
  }

  /**
   * 사용자명 중복 검사
   */
  private async checkUsernameDuplicate(username: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 사용자명입니다.');
    }
  }

  /**
   * 이메일 중복 검사
   */
  private async checkEmailDuplicate(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }
  }

  /**
   * 비밀번호 해싱
   */
  /**
   * 사용자 삭제
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user as any);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
} 