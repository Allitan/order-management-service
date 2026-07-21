export interface ApplicationConfiguration {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
}

export interface DatabaseConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
}

export interface AuthenticationConfiguration {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export interface Configuration {
  app: ApplicationConfiguration;
  database: DatabaseConfiguration;
  auth: AuthenticationConfiguration;
}

const configuration = (): Configuration => ({
  app: {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV as string,
    corsOrigin: process.env.CORS_ORIGIN as string,
  },
  database: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    ssl: process.env.DB_SSL === 'true',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  },
});

export default configuration;