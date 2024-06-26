import dotenv from "dotenv";
import Joi from "joi";
import { Config } from "../types/config.type";

dotenv.config();

const validateEnv = Joi.object({
  SERVER_PORT: Joi.number().required(),
  FRONT_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_TYPE: Joi.string().required(),
  JWT_ALGORITHM: Joi.string().required(),
  JWT_ACCESS_EXPIRESIN: Joi.string().required(),
  JWT_REFRESH_EXPIRESIN: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),

  SSH_HOST: Joi.string().required(),
  SSH_PORT: Joi.string().required(),
  SSH_USERNAME: Joi.string().required(),
  SSH_PASSWORD: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  USERNAME: Joi.string().required(),
  PASSWORD: Joi.string().required(),
  DATABASE: Joi.string().required(),
  SYNCRONIZE: Joi.number().required(),
}).unknown(true);

const { error, value: envVars } = validateEnv.validate(process.env);

if (error) {
  throw new Error(`환경 변수 유효성 검사 오류: ${error.message}`);
}

const config: Config = {
  PORT: envVars.SERVER_PORT,
  FRONT_URL: envVars.FRONT_URL,
  jwt: {
    JWT_ACCESS_SECRET: envVars.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
    JWT_TYPE: envVars.JWT_TYPE,
    JWT_ALGORITHM: envVars.JWT_ALGORITHM,
    JWT_ACCESS_EXPIRESIN: envVars.JWT_ACCESS_EXPIRESIN,
    JWT_REFRESH_EXPIRESIN: envVars.JWT_REFRESH_EXPIRESIN,
    JWT_ISSUER: envVars.JWT_ISSUER,
  },
  database: {
    SSH_HOST: envVars.SSH_HOST,
    SSH_PORT: envVars.SSH_PORT,
    SSH_USERNAME: envVars.SSH_USERNAME,
    SSH_PASSWORD: envVars.SSH_PASSWORD,
    DB_HOST: envVars.DB_HOST,
    DB_PORT: envVars.DB_PORT,
    USER: envVars.USERNAME,
    PASSWORD: envVars.PASSWORD,
    NAME: envVars.DATABASE,
    SYNCHRONIZE: envVars.SYNCRONIZE,
  },
};

export default config;
