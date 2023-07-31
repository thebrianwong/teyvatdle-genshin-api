import express from "express";
import { getConstellations } from "../controllers/constellationController";

const router = express.Router();

router.get("/", getConstellations);

export default router;
