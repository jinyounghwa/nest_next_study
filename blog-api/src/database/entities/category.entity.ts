import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('categories')
@Tree('closure-table') // 계층형 구조 지원
@Index(['slug'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 계층형 관계
  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent?: Category;

  // 게시글 관계
  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
} 