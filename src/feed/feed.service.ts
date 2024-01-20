import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';

import { PG_CONNECTION } from 'src/db/db.module';
import { GetFeedResponseDto, GetTopFeedResponseDto } from './dto';
import { Pagination } from 'src/common/decorator/pagination';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FeedService {
  constructor(
    @Inject(PG_CONNECTION) private readonly db: Pool,
    private readonly userService: UserService,
  ) {}

  async feed(userId: string, page: Pagination): Promise<GetFeedResponseDto> {
    try {
      const isExist = await this.userService.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const query = `
        SELECT
          u.id as user_id,
          u.username AS user_username,
          u.name AS user_name,
          u.avatar AS user_avatar,
          p.id AS post_id,
          p.content AS post_content,
          p.slug AS posT_slug,
          p.media_url AS post_media_url,
          p.created_at AS post_created_at
        FROM
          posts p
        JOIN
          followings f ON p.user_id = f.following_id
        JOIN
          users u ON f.following_id = u.id
        WHERE
          f.user_id = $1
        ORDER BY
          p.created_at DESC
        LIMIT $2 
        OFFSET $3;
      `;

      const feed = await this.db.query(query, [userId, page.limit, page.offset]);

      return { count: feed.rowCount, posts: feed.rows };
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // topFeed gets the top 30 posts on the platform based on the interactions with the posts
  async topFeed(): Promise<GetTopFeedResponseDto[]> {
    try {
      const query = `
        SELECT
          *,
          likes_count + comments_count AS total_interactions
        FROM posts
        ORDER BY total_interactions DESC
        LIMIT 30;
        `;

      const posts = await this.db.query<GetTopFeedResponseDto>(query);

      return posts.rows;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
