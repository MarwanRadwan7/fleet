import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { PostgresError } from 'pg-error-enum';

import {
  CreateUserDto,
  GetUserFollowersResponseDto,
  GetUserFollowingsResponseDto,
  UpdateUserDto,
  UserDto,
} from './dto';
import { Pagination } from 'src/common/decorator/pagination';
import { UserRepository } from './user.repository';
import { FollowRepository } from 'src/follow/follow.repository';
import { IUserService } from './contract';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
  ) {}

  async register(user: CreateUserDto): Promise<UserDto> {
    try {
      const res = await this.userRepository.create(user);
      return res;
    } catch (err) {
      console.error(err);
      if (err.code === PostgresError.UNIQUE_VIOLATION)
        throw new HttpException(
          'email or username address already registered',
          HttpStatus.CONFLICT,
        );
      if (err.code === PostgresError.NOT_NULL_VIOLATION)
        throw new HttpException('some fields are required', HttpStatus.BAD_REQUEST);
      throw new InternalServerErrorException();
    }
  }

  async update(userId: string, payload: UpdateUserDto): Promise<UserDto> {
    try {
      const isExist = await this.userRepository.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      // Encrypt if user updated password
      if (payload.password) {
        payload.password = await hash(payload.password);
      }

      payload['updatedAt'] = new Date().toISOString();

      const user = await this.userRepository.update(userId, payload);

      return user;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getById(userId: string): Promise<UserDto> {
    try {
      const isExist = await this.userRepository.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const user = await this.userRepository.findById(userId);

      return user;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getUserFollowers(userId: string, page: Pagination): Promise<GetUserFollowersResponseDto> {
    try {
      const isExist = await this.userRepository.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const users = await this.followRepository.getUserFollowers(userId, page);

      return { count: users.length, followers: users };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getUserFollowings(userId: string, page: Pagination): Promise<GetUserFollowingsResponseDto> {
    try {
      const isExist = await this.userRepository.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const users = await this.followRepository.getUserFollowings(userId, page);

      return { count: users.length, followings: users };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async deactivate(userId: string): Promise<void> {
    try {
      const isExist = await this.userRepository.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      await this.userRepository.deactivate(userId);

      return;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
