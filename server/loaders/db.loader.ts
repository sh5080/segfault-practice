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
let connectionCount = 0;
const MAX_CONNECTION_COUNT = 10;
// MySQL 연결을 초기화하는 함수
export async function dbLoader(): Promise<void> {
  try {
    connectionCount++;
    console.log("db refresh Count: ", connectionCount);
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
      await dbLoader();
      console.log("db reconnect");
    }
    if (connectionCount >= MAX_CONNECTION_COUNT) {
      console.log("Reached maximum connection count. Refreshing the pool.");
      mysqlPool = null;
      await dbLoader();
      console.log("db refresh");
      connectionCount = 0;
    }
    const connection = mysqlPool.promise();

    return connection;
  } catch (error) {
    console.error(error);
    mysqlPool = null;
    console.log("db refresh");
    throw error;
  }
}
