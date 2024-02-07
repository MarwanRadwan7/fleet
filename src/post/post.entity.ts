import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { randomInt } from 'crypto';

import { User } from 'src/user/user.entity';
import { PostLike } from 'src/like/like.entity';
import { PostComment } from 'src/comment/comment.entity';

@Entity({ name: 'posts' })
@Index('idx_posts_user_id', ['userId'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @Column({
    nullable: false,
    length: 240,
  })
  public content: string;

  @Column({
    name: 'media_url',
    nullable: true,
    length: 2048,
  })
  public mediaUrl: string;

  @Column({
    nullable: true,
    default: () => randomInt(1e12).toString(),
    length: 240,
  })
  public slug: string;

  @Column({
    nullable: true,
    length: 240,
  })
  public hashtags: string;

  @Column({
    nullable: true,
    length: 240,
  })
  public tags: string;

  @Column({
    nullable: true,
    type: 'decimal',
  })
  public lat: string;

  @Column({
    nullable: true,
    type: 'decimal',
  })
  public lng: string;

  @Column({
    type: 'boolean',
    name: 'is_edited',
    nullable: true,
    default: false,
  })
  public isEdited: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  @Column({
    name: 'likes_count',
    type: 'int',
    default: 0,
  })
  likesCount: number;

  @Column({
    name: 'comments_count',
    type: 'int',
    default: 0,
  })
  commentsCount: number;

  // Relations
  @OneToMany(() => PostLike, likes => likes.postId)
  likes: PostLike[];

  @OneToMany(() => PostComment, comments => comments.postId)
  comments: PostLike[];
}
