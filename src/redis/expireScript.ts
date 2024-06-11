import { exit } from "process";
import expireAllKeys from "./expireAllKeys";
import { redisClient } from "./redis";

const expireScript = async () => {
  await expireAllKeys();
  console.log("Expiring Keys.");
  await redisClient.quit();
  exit();
};

expireScript();
