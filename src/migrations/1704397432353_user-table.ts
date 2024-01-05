/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  await pgm.sql(`
    CREATE TABLE users (
      id VARCHAR(240) PRIMARY KEY,
      username VARCHAR(30) NOT NULL UNIQUE,
      name VARCHAR(30) NOT NULL,
      email VARCHAR(30) NOT NULL UNIQUE,
      phone VARCHAR(20) NOT NULL,
      password VARCHAR(240) NOT NULL,
      avatar VARCHAR(240) DEFAULT 'default.png',
      bio VARCHAR(30),
      birth_date DATE NOT NULL,
      is_active BOOLEAN DEFAULT true,
      role VARCHAR(30) DEFAULT 'member' ,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  await pgm.sql(`
    DROP TABLE users;
  `);
}
