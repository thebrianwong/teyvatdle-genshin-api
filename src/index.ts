import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";
import "reflect-metadata";
import { DataSource } from "typeorm";
import regionRouter from "./routes/region";
import localSpecialtyRouter from "./routes/localSpecialty";
import weaponRouter from "./routes/weapon";
import foodRouter from "./routes/food";
import characterRouter from "./routes/character";
import talentRouter from "./routes/talent";
import constellationRouter from "./routes/constellation";
import teyvatdleGameDataRouter from "./routes/teyvatdleGameData";
import createWebSocketServer from "./websockets/teyvatdleGameDataWebSocket";
import realDataSource from "./postgres/postgresConfig";
import testDataSource from "./postgres/postgresTestConfig";
import { createDailyRecordJob } from "./cron/createDailyRecordCronJob";
import { preventServerSleepJob } from "./cron/preventServerSleepCronJob";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { readFileSync } from "fs";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { resolvers } from "./graphql/resolversMap";
import WebSocket from "ws";

dotenv.config();

let app: express.Application;
let AppDataSource: DataSource;
let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;
let webSocketServer: WebSocket.Server<
  typeof WebSocket,
  typeof http.IncomingMessage
>;

const main = async () => {
  app = express();
  const port = process.env.PORT || 4000;

  let dataSourceConfig: DataSource;

  if (process.env.TEST) {
    console.log("Connected to the test DB.");
    dataSourceConfig = testDataSource;
  } else {
    console.log("Connected to real DB.");
    dataSourceConfig = realDataSource;
  }

  AppDataSource = dataSourceConfig!;

  AppDataSource.initialize().catch((error) => console.log(error));

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(logger("dev"));
  app.use(
    cors({
      origin: process.env.TEYVATDLE_FRONTEND,
    })
  );
  app.use(compression());
  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
  }

  app.use("/api/region", regionRouter);
  app.use("/api/local_specialty", localSpecialtyRouter);
  app.use("/api/weapon", weaponRouter);
  app.use("/api/food", foodRouter);
  app.use("/api/character", characterRouter);
  app.use("/api/talent", talentRouter);
  app.use("/api/constellation", constellationRouter);
  app.use("/api/teyvatdle", teyvatdleGameDataRouter);

  createDailyRecordJob.start();

  console.log(
    "Cron job to create a new daily record on a daily basis has been started."
  );

  if (process.env.NODE_ENV === "production") {
    preventServerSleepJob.start();
    console.log(
      "Cron job to prevent the server from sleeping has been started."
    );
  }

  server = http.createServer(app);

  // graphql
  const typeDefs = readFileSync("./schema/schema.graphql", {
    encoding: "utf-8",
  });

  const apolloServer = new ApolloServer<{
    token?: String | undefined;
  }>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // end graphql

  webSocketServer = createWebSocketServer(server);

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
  });

  app.use(
    (
      err: Error & { status?: number },
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      res.status(err.status || 500);
      res.send({ message: "Invalid URL." });
    }
  );

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

main();

export { app, AppDataSource, server, webSocketServer };
