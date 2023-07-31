import express from "express";
import { getTalents } from "../controllers/talentController";

const router = express.Router();

router.get("/", getTalents);

export default router;
