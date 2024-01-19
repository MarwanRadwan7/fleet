import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PostgresError } from 'pg-error-enum';

import {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserByUsernameResponseDto,
  GetUserDataDto,
  GetUserFollowersResponseDto,
  GetUserFollowingsResponseDto,
  GetUserResponseDto,
  UpdateUserDto,
  UpdateUserResponseDto,
} from './dto';
import { PG_CONNECTION } from 'src/db/db.module';
import { Pagination } from 'src/common/decorator/pagination';

@Injectable()
export class UserService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async isExist(userId: string): Promise<boolean> {
    try {
      const user = await this.db.query(
        `
          SELECT id
          FROM users 
          WHERE id = $1;
        `,
        [userId],
      );

      if (user.rowCount === 0) return false;

      return true;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async create(user: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const hashedPassword = await hash(user.password, 12);
      const res = await this.db.query<CreateUserResponseDto>(
        `
        INSERT INTO users(id, username, name, email, phone, password, birth_date, avatar)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id, username, name, email, phone, birth_date, avatar, bio;
      `,
        [
          randomUUID(),
          user.username,
          user.name,
          user.email,
          user.phone,
          hashedPassword,
          user.birthDate,
          user.avatar,
        ],
      );
      return res.rows[0];
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.UNIQUE_VIOLATION)
        throw new HttpException(
          'email or username address already registered',
          HttpStatus.CONFLICT,
        );
      throw new InternalServerErrorException();
    }
  }

  async update(userId: string, payload: UpdateUserDto): Promise<UpdateUserResponseDto> {
    try {
      const isExist = await this.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      // Encrypt if user updated password
      if (payload.password) {
        payload.password = await hash(payload.password, 12);
      }
      // BirthDate type annotation
      if (payload.birthDate) {
        payload['birth_date'] = payload.birthDate;
        delete payload.birthDate;
      }
      payload['updated_at'] = new Date().toISOString();

      const fields = Object.keys(payload);
      const values = [userId, ...Object.values(payload)];

      const query = `
        UPDATE users
        SET ${fields.map((field, index) => `${field} = $${index + 2}`).join(', ')}
        WHERE id = $1
        RETURNING id, username, name, email, phone, birth_date, avatar;
      `;

      const user = await this.db.query<UpdateUserResponseDto>(query, values);

      return user.rows[0];
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getById(userId: string): Promise<GetUserResponseDto> {
    try {
      const user = await this.db.query<GetUserResponseDto>(
        `
          SELECT id, username, name, email, phone, birth_date, avatar, bio
          FROM users 
          WHERE id = $1;
        `,
        [userId],
      );

      if (user.rowCount === 0) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      return user.rows[0];
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // getByUsername used in auth service to retrieve user auth info
  async getByUsername(username: string): Promise<GetUserByUsernameResponseDto> {
    try {
      const user = await this.db.query<GetUserByUsernameResponseDto>(
        `
          SELECT id, username, name, email, password, is_active
          FROM users 
          WHERE username = $1;
        `,
        [username],
      );

      if (user.rowCount === 0) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      return user.rows[0];
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getUserFollowers(
    payload: GetUserDataDto,
    page: Pagination,
  ): Promise<GetUserFollowersResponseDto> {
    try {
      const isExist = await this.isExist(payload.user_id);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const users = await this.db.query(
        `
          SELECT u.id AS user_id, u.username, u.name, u.avatar
          FROM followers AS f
          LEFT JOIN users AS u
          ON u.id = f.follower_id
          WHERE f.user_id = $1
          LIMIT $2
          OFFSET $3;
        `,
        [payload.user_id, page.limit, page.offset],
      );

      return { count: users.rowCount, followers: users.rows };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getUserFollowings(
    payload: GetUserDataDto,
    page: Pagination,
  ): Promise<GetUserFollowingsResponseDto> {
    try {
      const isExist = await this.isExist(payload.user_id);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const users = await this.db.query(
        `
          SELECT u.id AS user_id, u.username, u.name, u.avatar
          FROM followings AS f
          LEFT JOIN users AS u
          ON u.id = f.following_id
          WHERE f.user_id = $1
          LIMIT $2
          OFFSET $3;
        `,
        [payload.user_id, page.limit, page.offset],
      );

      return { count: users.rowCount, followings: users.rows };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async delete(payload: GetUserDataDto): Promise<void> {
    try {
      const isExist = await this.isExist(payload.user_id);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      await this.db.query(
        `
        UPDATE users
        SET is_active = false , updated_at = $2
        WHERE id = $1
        RETURNING id;
      `,
        [payload.user_id, new Date().toISOString()],
      );

      return;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
