import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserRepository } from './contract';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { User } from './user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class UserRepository implements IUserRepository {
  private userRepository: Repository<User>;

  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async isExist(userId: string): Promise<boolean> {
    // Check the UUID type
    const isValidUUID = isUUID(userId);
    if (!isValidUUID) return false;

    // Check the user
    const user = await this.userRepository.exists({
      where: {
        id: userId,
      },
    });

    if (isValidUUID && user) return true;

    return false;
  }

  async findById(userId: string): Promise<UserDto | undefined> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async findByUsername(username: string): Promise<UserDto | undefined> {
    return await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        password: true,
        isActive: true,
      },
      where: {
        username,
      },
    });
  }

  async findByEmail(email: string): Promise<UserDto | undefined> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    const userEnt = this.userRepository.create(user);
    const createUser = await this.userRepository.save(userEnt);

    delete createUser['password'];

    return createUser;
  }

  async update(userId: string, user: UpdateUserDto): Promise<UserDto> {
    await this.userRepository.update({ id: userId }, user);
    const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
    return updatedUser;
  }

  async deactivate(userId: string): Promise<void> {
    await this.userRepository.update(
      {
        id: userId,
      },
      {
        isActive: false,
        updatedAt: new Date().toISOString(),
      },
    );
  }
  s;
}
