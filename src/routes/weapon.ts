import express from "express";
import { getWeapons } from "../controllers/weaponController";

const router = express.Router();

router.get("/", getWeapons);

export default router;
