import { Pagination } from 'src/common/decorator/pagination';
import { CreatePostDto, PostDto, UpdatePostDto } from '../dto';

export interface IPostRepository {
  isExist(postId: string): Promise<boolean>;
  create(userId: string, payload: CreatePostDto): Promise<any>;
  update(postId: string, payload: UpdatePostDto): Promise<any>;
  getByPostId(postId: string): Promise<any>;
  delete(postId: string): Promise<void>;

  incrementLikes(postId: string): Promise<void>;
  decrementLikes(postId: string): Promise<void>;
  incrementComments(postId: string): Promise<void>;
  decrementComments(postId: string): Promise<void>;
  getByPostId(postId: string): Promise<PostDto>;
  getAllByUserId(userId: string, page: Pagination): Promise<PostDto[]>;
  getPostsByHashtags(hashtags: string[], page: Pagination): Promise<any>;
  getFeedPosts(userId: string, page: Pagination): Promise<any>;
  getTopFeedPosts(): Promise<any>;
}
