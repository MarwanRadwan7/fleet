export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
