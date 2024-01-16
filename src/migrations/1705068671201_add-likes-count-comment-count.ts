/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE posts
    ADD COLUMN likes_count INT DEFAULT 0 ,
    ADD COLUMN comments_count INT DEFAULT 0;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE posts
    DROP COLUMN likes_count, comments_count ;
  `);
}
