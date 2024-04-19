import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'argon2';
import { Exclude } from 'class-transformer';

import { Room } from 'src/modules/chat/entities';
import { Post } from 'src//modules/post/post.entity';
import { Block } from 'src/modules/block/block.entity';
import { PostLike } from 'src/modules/like/like.entity';
import { Follower, Following } from 'src/modules/follow/follow.entity';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    unique: true,
    nullable: false,
    length: 30,
  })
  public username: string;

  @Column({
    unique: true,
    nullable: false,
    length: 30,
  })
  public email: string;

  @Column({
    select: false,
    nullable: false,
    length: 240,
  })
  public password: string;
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }

  @Column({
    name: 'first_name',
    nullable: false,
    length: 30,
  })
  public firstName: string;

  @Column({ name: 'last_name', nullable: false, length: 30 })
  public lastName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public bio: string | null;

  @Column({
    nullable: true,
    default: 'default.png',
    length: 240,
  })
  public avatar: string | null;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: false,
  })
  public birthDate: Date;

  @Column({
    nullable: false,
    length: 30,
  })
  public phone: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: true,
    default: true,
  })
  public isActive: boolean;

  @Column({
    type: 'enum',
    select: false,
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  public role: UserRole;

  @Column({
    select: false,
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

  // Relations
  @OneToMany(() => Following, following => following.userId)
  followings: Following[];

  @OneToMany(() => Follower, follower => follower.userId)
  followers: Follower[];

  @OneToMany(() => Post, posts => posts.userId)
  posts: Post[];

  @OneToMany(() => Block, blocks => blocks.userId)
  blocks: Block[];

  @OneToMany(() => PostLike, likes => likes.userId)
  likes: PostLike[];

  @ManyToMany(() => Room, room => room.members)
  rooms: Room[];
}
