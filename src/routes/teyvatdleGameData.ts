import express from "express";
import {
  getDailyRecord,
  getGameData,
  updateDailyRecord,
} from "../controllers/teyvatdleGameDataController";

const router = express.Router();

router.get("/", getGameData);

router.get("/daily_record", getDailyRecord);

router.patch("/daily_record/:id/:type", updateDailyRecord);

export default router;
