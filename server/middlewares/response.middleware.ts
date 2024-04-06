import { Request, Response, NextFunction } from "express";

const responseTime = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const elapsedTime = Date.now() - start;
    console.log(
      `[${req.method}]  ${req.originalUrl}  Request took ${elapsedTime}ms`
    );
  });

  next();
};

export default responseTime;
