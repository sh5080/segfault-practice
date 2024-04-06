import { Sequelize } from "sequelize";
import config from "../config";

const { HOST, DB_PORT, USER, PASSWORD, NAME } = config.database;

// 첫 번째 DB에 대한 연결 설정
export const mysqlDB = new Sequelize({
  dialect: "mysql",
  host: HOST,
  port: DB_PORT,
  username: USER,
  password: PASSWORD,
  database: NAME,
  logging: false,
});

// DB 로더 함수
export const dbLoader = async () => {
  try {
    //DB 연결 확인
    await mysqlDB.authenticate();
    console.log(
      "Connection to the first database has been established successfully"
    );

    return {
      mysqlDB,
    };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};
