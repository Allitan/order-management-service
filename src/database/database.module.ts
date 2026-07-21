import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from '../config/configuration';
import { createTypeOrmOptions } from './typeorm.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfiguration =
          configService.getOrThrow<DatabaseConfiguration>('database');

        return {
          ...createTypeOrmOptions(databaseConfiguration),
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}