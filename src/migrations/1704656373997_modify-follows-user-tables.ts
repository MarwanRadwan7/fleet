/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  return pgm.sql(
    `
      -- Add two new columns to store the smaller and larger user IDs
      ALTER TABLE follows
      ADD COLUMN smaller_user_id VARCHAR(240),
      ADD COLUMN larger_user_id VARCHAR(240);
      
      -- Populate the new columns with the corresponding values
      UPDATE follows
      SET smaller_user_id = LEAST(user_id, friend_id),
          larger_user_id = GREATEST(user_id, friend_id);
      
      -- Add a unique constraint on the new columns
      ALTER TABLE follows
      ADD CONSTRAINT unique_following UNIQUE (smaller_user_id, larger_user_id);
      
      -- Drop the temporary columns
      ALTER TABLE follows
      DROP COLUMN IF EXISTS smaller_user_id,
      DROP COLUMN IF EXISTS larger_user_id;

      ALTER TABLE users
      ALTER COLUMN avatar SET DEFAULT 'default.png';
    `,
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `
    ALTER TABLE follows
    DROP CONSTRAINT unique_following;

    ALTER TABLE users
    ALTER COLUMN avatar DROP DEFAULT;
  `,
  );
}
