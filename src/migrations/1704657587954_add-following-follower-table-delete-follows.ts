/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `
      DROP TABLE follows;
      
      CREATE TABLE followings (
        id VARCHAR(240) PRIMARY KEY,
        user_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        following_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE followers (
        id VARCHAR(240) PRIMARY KEY,
        user_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        follower_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `,
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `
      DROP TABLE IF EXISTS followings;
      
      DROP TABLE IF EXISTS followers;

      CREATE TABLE follows (
        id VARCHAR(240) PRIMARY KEY,
        user_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        friend_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `,
  );
}
