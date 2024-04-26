export class CommentDto {
  public id: string;
  public content: string;
  public postId: string;
  public userId: string;
  public isEdited: boolean;
  public createdAt: Date;
  public updatedAt: Date;
}
