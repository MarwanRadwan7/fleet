import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenvConfig({ path: '.env' });

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: `${process.env.DATABASE_NAME}`,
  host: `${process.env.DATABASE_HOST}`,
  username: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  port: 5432,
  schema: 'public',
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join('dist/migrations/*.{ts,js}')],
  synchronize: false,
  migrationsTableName: 'migrations_table',
  migrationsRun: true,
  logging: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
