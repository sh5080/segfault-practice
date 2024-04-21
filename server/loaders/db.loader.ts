import config from "../config";
import mysql from "mysql2";
import { Client } from "ssh2";
const sshClient = new Client();

const {
  SSH_HOST,
  SSH_PORT,
  SSH_PASSWORD,
  DB_HOST,
  DB_PORT,
  USER,
  PASSWORD,
  NAME,
} = config.database;

const dbServer = {
  host: DB_HOST,
  port: DB_PORT,
  user: USER,
  password: PASSWORD,
  database: NAME,
};
// SSH 터널링 설정

const forwardConfig = {
  srcHost: DB_HOST,
  srcPort: DB_PORT,
  dstHost: dbServer.host,
  dstPort: dbServer.port,
};
const tunnelConfig = {
  host: SSH_HOST,
  port: SSH_PORT,
  username: USER,
  password: SSH_PASSWORD,
};
let mysqlPool: mysql.Pool;

// MySQL 연결을 초기화하는 함수
export async function dbLoader(): Promise<void> {
  try {
    if (process.env.NODE_ENV === "development") {
      sshClient
        .on("ready", () => {
          sshClient.forwardOut(
            forwardConfig.srcHost,
            forwardConfig.srcPort,
            forwardConfig.dstHost,
            forwardConfig.dstPort,
            (err, stream) => {
              if (err) throw err;
              const updatedDbServer = {
                ...dbServer,
                stream,
              };
              mysqlPool = mysql.createPool(updatedDbServer);
              console.log("MySQL Pool initialized.");
            }
          );
        })
        .connect(tunnelConfig);
    } else {
      mysqlPool = mysql.createPool(dbServer);
      console.log("MySQL Pool initialized.");
    }
  } catch (error) {
    console.error("Unable to initialize database:", error);
    throw error;
  }
}

// MySQL 연결을 가져오는 함수
export async function getDBConnection() {
  try {
    if (!mysqlPool) {
      throw new Error("MySQL 연결 풀이 초기화되지 않았습니다.");
    }
    return mysqlPool.promise();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
