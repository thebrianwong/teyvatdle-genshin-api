import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
  },
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
});
client.on("connect", () => console.log("Successfully connected to Redis"));
client.on("error", (err: string) => console.log(err));
client.connect();

export default client;
