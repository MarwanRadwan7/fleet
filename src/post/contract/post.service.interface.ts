import { Pagination } from 'src/common/decorator/pagination';
import {
  CreatePostDto,
  GetPostCommentsResponseDto,
  GetPostLikesResponseDto,
  GetPostsByUserResponseDto,
  PostDto,
  UpdatePostDto,
} from '../dto';

export interface IPostService {
  create(userId: string, payload: CreatePostDto): Promise<PostDto>;
  update(postId: string, payload: UpdatePostDto): Promise<PostDto>;
  getById(postId: string): Promise<PostDto>;
  delete(postId: string): Promise<void>;
  getPostLikes(postId: string, page: Pagination): Promise<GetPostLikesResponseDto>;
  getPostComments(postId: string, page: Pagination): Promise<GetPostCommentsResponseDto>;
  getPostsByUser(userId: string, page: Pagination): Promise<GetPostsByUserResponseDto>;
  getPostsByHashtags(hashtags: string[], page: Pagination): Promise<any>;
}
