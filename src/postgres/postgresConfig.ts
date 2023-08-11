import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const realDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE_NAME,
  logging: true,
  entities: [__dirname + "/../models/**/*.model.js"],
  subscribers: [],
  migrations: [],
  entityPrefix: "genshin.",
});

export default realDataSource;
