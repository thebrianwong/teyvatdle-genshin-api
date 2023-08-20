import { CronJob } from "cron";
import { createDailyRecord } from "../controllers/teyvatdleGameDataController";

export const createDailyRecordJob = new CronJob(
  "0 0 0 * * *",
  async () => await createDailyRecord(),
  null,
  false,
  "America/Los_Angeles"
);
