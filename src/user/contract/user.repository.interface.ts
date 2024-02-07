import { CreateUserDto, UpdateUserDto, UserDto } from '../dto';

export interface IUserRepository {
  isExist(userId: string): Promise<boolean>;
  findById(userId: string): Promise<UserDto | undefined>;
  findByUsername(username: string): Promise<UserDto | undefined>;
  findByEmail(email: string): Promise<UserDto | undefined>;
  create(user: CreateUserDto): Promise<UserDto>;
  update(userId: string, user: UpdateUserDto): Promise<UserDto>;
  deactivate(userId: string): Promise<void>;
}
