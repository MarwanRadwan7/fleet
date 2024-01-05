import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';

import { PG_CONNECTION } from 'src/db/db.module';
import { CreateUserDto, CreateUserType, GetUserType, UpdateUserDto, UpdateUserType } from './dto';

@Injectable()
export class UserService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async create(user: CreateUserDto): Promise<CreateUserType[]> {
    try {
      const hashedPassword = await hash(user.password, 12);
      const res = await this.db.query<CreateUserType>(
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
      return res.rows;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, payload: UpdateUserDto): Promise<UpdateUserType[]> {
    try {
      if (payload.password) {
        payload.password = await hash(payload.password, 12);
      }
      if (payload.birthDate) {
        payload['birth_date'] = payload.birthDate;
        delete payload.birthDate;
      }
      payload['updated_at'] = new Date().toISOString();

      const updateFields = Object.keys(payload);
      const updateValues = [id, ...Object.values(payload)];
      const updateQuery = `
        UPDATE users
        SET ${updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ')}
        WHERE id = $1
        RETURNING id, username, name, email, phone, birth_date, avatar;
      `;

      const user = await this.db.query<UpdateUserType>(updateQuery, updateValues);
      return user.rows;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async get(id: string): Promise<GetUserType[]> {
    try {
      const user = await this.db.query<GetUserType>(
        `
          SELECT id, username, name, email, phone, birth_date, avatar, bio
          FROM users 
          WHERE id = $1;
        `,
        [id],
      );

      return user.rows;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.query(
        `
        UPDATE users
        SET is_active = false , updated_at = ${new Date().toISOString()}
        WHERE id = $1;
      `,
        [id],
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
