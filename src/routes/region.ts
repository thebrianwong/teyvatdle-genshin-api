import express from "express";
import { getRegions } from "../controllers/regionController";

const router = express.Router();

router.get("/", getRegions);

export default router;
