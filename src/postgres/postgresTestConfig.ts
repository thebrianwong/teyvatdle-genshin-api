import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const testDataSource = new DataSource({
  type: "postgres",
  host: process.env.TEST_PG_HOST,
  port: Number(process.env.TEST_PG_PORT),
  username: process.env.TEST_PG_USERNAME,
  password: process.env.TEST_PG_PASSWORD,
  database: process.env.TEST_PG_DATABASE_NAME,
  logging: true,
  entities: [__dirname + "/../models/**/*.model.js"],
  subscribers: [],
  migrations: [],
  entityPrefix: "genshin.",
});

export default testDataSource;
