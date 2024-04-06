import express, { Application } from "express";
import routeLoader from "./route.loader";
import { errorHandler } from "../middlewares/error.middleware";
import responseTime from "../middlewares/response.middleware";
import path from "path";

export default async function expressLoader(
  app: Application
): Promise<Application> {
  try {
    app.use(responseTime);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "uploads")));

    routeLoader(app);
    app.use(errorHandler);

    return app;
  } catch (error) {
    console.error(
      "Error occurred during Express loader initialization:",
      error
    );
    throw error;
  }
}
