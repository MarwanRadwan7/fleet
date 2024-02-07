import { CreateBlockDto } from '../dto';

export interface IBlockService {
  block(userId: string, payload: CreateBlockDto): Promise<void>;
  unBlock(userId: string, friendId: string): Promise<void>;
}
