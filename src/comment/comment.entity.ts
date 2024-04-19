import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';

@Entity({ name: 'post_comments' })
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Post, post => post.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  postId: Post;

  @Column({
    nullable: false,
    length: 240,
  })
  public content: string;

  @Column({
    type: 'boolean',
    name: 'is_edited',
    default: false,
  })
  public isEdited: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
