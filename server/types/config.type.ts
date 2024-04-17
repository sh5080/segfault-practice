export interface Config {
  PORT: number;
  FRONT_URL: string;
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
    SSH_HOST: string;
    SSH_PORT: string;
    SSH_USERNAME: string;
    SSH_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    USER: string;
    PASSWORD: string;
    NAME: string;
    SYNCHRONIZE: number;
  };
}
