import express, { Application, Request, Response } from "express";
import router from "../routes/index";

const routeLoader = (app: Application): Application => {
  app.get("/", (req: Request, res: Response) => {
    const userAgent = req.headers["user-agent"];
    res.send(`User-Agent: ${userAgent}`);
  });

  /** 정적 파일 경로 */
  // app.use("/static", express.static("public"));

  /** 라우팅 */
  app.use("/api", router);
  return app;
};

export default routeLoader;
