/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE followings
    ADD CONSTRAINT unique_following_id UNIQUE (user_id, following_id);

    ALTER TABLE followers
    ADD CONSTRAINT unique_follower_id UNIQUE (user_id, follower_id);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE followings
    DROP CONSTRAINT unique_following_id;
    
    ALTER TABLE followers
    DROP CONSTRAINT unique_follower_id;
  `);
}
