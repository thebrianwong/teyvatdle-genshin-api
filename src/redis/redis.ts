import dotenv from "dotenv";
import { Redis } from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

dotenv.config();

const options = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

const redisClient = new Redis(options);

const redisPubSub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export { redisClient, redisPubSub };
