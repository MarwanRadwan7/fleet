import { Exclude, Expose } from 'class-transformer';
import { PostLike } from 'src/like/like.entity';

import { User } from 'src/user/user.entity';

export class PostDto {
  @Expose()
  public id: string;

  @Expose()
  public content: string;

  @Expose()
  public slug: string;

  @Expose()
  public userId: User;

  @Expose()
  public mediaUrl: string;

  @Expose()
  public hashtags: string;

  @Expose()
  public tags: string;

  @Expose()
  public isEdited: boolean;

  @Exclude({ toPlainOnly: true })
  public lat: string;

  @Exclude({ toPlainOnly: true })
  public lng: string;

  @Expose()
  public likesCount: number;

  @Expose()
  public commentsCount: number;

  @Exclude({ toPlainOnly: true })
  public createdAt: Date;

  @Exclude({ toPlainOnly: true })
  public updatedAt: Date;

  @Exclude({ toClassOnly: true })
  likes: PostLike[];

  @Exclude({ toClassOnly: true })
  comments: PostLike[];
}
