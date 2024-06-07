import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";
import "reflect-metadata";
import { DataSource } from "typeorm";
import regionRouter from "./routes/region";
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
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

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
let pubSub: PubSub;

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
  app.use(compression());
  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
  }

  // used to prevent server from sleeping
  app.use("/api/region", regionRouter);

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

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  webSocketServer = createWebSocketServer(server);
  const serverCleanup = useServer({ schema }, webSocketServer);

  const apolloServer = new ApolloServer<{
    token?: String | undefined;
  }>({
    introspection: true,
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: server }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  pubSub = new PubSub();

  app.use(
    "/graphql",
    cors({
      origin: process.env.TEYVATDLE_FRONTEND,
    }),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // end graphql

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

export { app, AppDataSource, server, webSocketServer, pubSub };
