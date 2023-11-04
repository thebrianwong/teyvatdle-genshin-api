import { CronJob } from "cron";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

const serverDomain = process.env.DOMAIN;

export const preventServerSleepJob = new CronJob(
  "* 10 * * * *",
  () => {
    https.get(`https://${serverDomain}/api/region`);
    console.log("Part of cron job to prevent server from sleeping.");
  },
  null,
  false,
  "America/Los_Angeles"
);
