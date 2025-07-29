import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { Category } from '../../database/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Category]),
    CategoriesModule, // 카테고리 서비스 사용을 위해 import
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {} 