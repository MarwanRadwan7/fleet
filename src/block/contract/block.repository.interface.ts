export interface IBlockRepository {
  isBlocked(userId: string, friendId: string): Promise<boolean>;
  createBlock(userId: string, friendId: string): Promise<void>;
  removeBlock(userId: string, friendId: string): Promise<void>;
}
