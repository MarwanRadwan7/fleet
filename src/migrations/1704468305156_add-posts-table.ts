/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  return pgm.sql(
    `
      CREATE TABLE posts(
        id VARCHAR(240) PRIMARY KEY,
        user_id VARCHAR(240) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        slug VARCHAR(100),
        content VARCHAR(240) NOT NULL,
        media_url VARCHAR(2048),
        media_thumbnail VARCHAR(2048),
        hashtags VARCHAR(240),
        tags  VARCHAR(100),
        lat DECIMAL,
        lng DECIMAL,
        edited BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Add an index on the user_id column
      CREATE INDEX idx_posts_user_id ON posts(user_id);
    `,
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  return pgm.sql(`
    DROP INDEX idx_posts_user_id ;
    DROP TABLE posts;
  `);
}
