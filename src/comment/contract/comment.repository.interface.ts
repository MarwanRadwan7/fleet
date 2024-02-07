import { CommentDto, CreateCommentPostDto, UpdateCommentPostDto } from '../dto';
import { PostComment } from '../comment.entity';
import { Pagination } from 'src/common/decorator/pagination';

export interface ICommentRepository {
  isExist(commentId: string): Promise<boolean>;
  create(userId: string, payload: CreateCommentPostDto): Promise<PostComment>;
  get(commentId: string): Promise<CommentDto>;
  getPostCommentsData(postId: string, page: Pagination): Promise<any>;
  update(commentId: string, payload: UpdateCommentPostDto): Promise<CommentDto>;
  delete(commentId: string): Promise<void>;
}
