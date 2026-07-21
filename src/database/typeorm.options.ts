import { DataSourceOptions } from 'typeorm';
import { join } from 'node:path';
import { DatabaseConfiguration } from '../config/configuration';

export function createTypeOrmOptions(
  databaseConfiguration: DatabaseConfiguration,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: databaseConfiguration.host,
    port: databaseConfiguration.port,
    username: databaseConfiguration.username,
    password: databaseConfiguration.password,
    database: databaseConfiguration.database,
    ssl: databaseConfiguration.ssl
      ? { rejectUnauthorized: false }
      : false,
    synchronize: false,
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrationsTableName: 'migrations',
    migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  };
}