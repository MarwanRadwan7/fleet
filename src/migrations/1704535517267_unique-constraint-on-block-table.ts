/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
   ALTER TABLE blocks
   ADD CONSTRAINT unique_block UNIQUE (user_id, friend_id);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
   ALTER TABLE blocks
   DROP CONSTRAINT unique_block;
  `);
}
