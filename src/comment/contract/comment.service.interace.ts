import { PostComment } from '../comment.entity';
import { CommentDto, CreateCommentPostDto, UpdateCommentPostDto } from '../dto';

export interface ICommentService {
  create(userId: string, payload: CreateCommentPostDto): Promise<PostComment>;
  get(commentId: string): Promise<CommentDto>;
  update(commentId: string, payload: UpdateCommentPostDto): Promise<CommentDto>;
  delete(commentId: string): Promise<void>;
}
