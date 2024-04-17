import express from "express";
import config from "./config/index";
import expressLoader from "./loaders/express.loader";
import { dbLoader } from "./loaders/db.loader"; // dbLoader를 import합니다.

const port = config.PORT || 4000;
const app = express();

async function startServer() {
  try {
    const db = await dbLoader();
    const expressApp = await expressLoader(app);

    // 서버 시작
    expressApp.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  } catch (error) {
    console.error("Error occurred during server startup:", error);
    process.exit(1);
  }
}

startServer();
