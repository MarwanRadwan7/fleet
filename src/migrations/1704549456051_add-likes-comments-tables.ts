/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `
      CREATE TABLE post_likes (
      user_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      post_id VARCHAR(240) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (user_id, post_id)
      );

      CREATE TABLE post_comments (
        id VARCHAR(240) PRIMARY KEY,
        user_id VARCHAR(240) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        post_id VARCHAR(240) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        content VARCHAR(240) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `,
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `
      DROP TABLE post_likes;
      DROP TABLE post_comments;
    `,
  );
}
