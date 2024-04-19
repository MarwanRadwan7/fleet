import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Post } from 'src//modules/post/post.entity';

@Entity({ name: 'post_likes' })
@Unique('unique_like_record', ['userId', 'postId'])
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Post, post => post.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  postId: Post;
}
