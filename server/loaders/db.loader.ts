import { Sequelize } from "sequelize";
import config from "../config";

import { SshTunnel } from "ssh-tunneling";

const {
  SSH_HOST,
  SSH_PORT,
  SSH_USERNAME,
  SSH_PASSWORD,
  DB_HOST,
  DB_PORT,
  USER,
  PASSWORD,
  NAME,
} = config.database;
// SSH 터널링 설정
const sshConfig = {
  host: SSH_HOST,
  port: SSH_PORT,
  username: SSH_USERNAME,
  password: SSH_PASSWORD,
};
const client = new SshTunnel(sshConfig);

// MySQL 연결 설정
const mysqlDB = new Sequelize({
  dialect: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  username: USER,
  password: PASSWORD,
  database: NAME,
  logging: false,
});

// 데이터베이스 연결 테스트 함수
async function testDatabaseConnection() {
  try {
    // MySQL 연결 테스트
    await mysqlDB.authenticate();
    console.log("Connected to MySQL database successfully!");
  } catch (error) {
    console.error("Unable to connect to the MySQL database:", error);
  }
}

// SSH 터널링 설정 및 MySQL 연결을 초기화하는 함수
export async function dbLoader() {
  try {
    const forwardInfo = await client.forwardOut(`3000:${SSH_HOST}:3000`);
    console.log("#### SSH Tunneling Info:", forwardInfo);

    await testDatabaseConnection();
  } catch (error) {
    console.error("Unable to initialize database:", error);
    throw error;
  }
}

export { mysqlDB };
