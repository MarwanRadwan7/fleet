import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

const dbProvider = {
  provide: PG_CONNECTION,
  useFactory: async (configService: ConfigService) => {
    return new Pool({
      database: configService.get('DATABASE_NAME'),
      host: configService.get('DATABASE_HOST'),
      user: configService.get('DATABASE_USER'),
      password: configService.get('DATABASE_PASSWORD'),
      port: configService.get('DATABASE_PORT'),
    });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
