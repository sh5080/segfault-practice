export interface Config {
  PORT: number;
  jwt: {
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_TYPE: string;
    JWT_ALGORITHM: string;
    JWT_ACCESS_EXPIRESIN: number;
    JWT_REFRESH_EXPIRESIN: number;
    JWT_ISSUER: string;
  };
  database: {
    HOST: string;
    DB_PORT: number;
    USER: string;
    PASSWORD: string;
    NAME: string;
    SYNCHRONIZE: number;
  };
}
