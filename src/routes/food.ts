import express from "express";
import { getFoods } from "../controllers/foodController";

const router = express.Router();

router.get("/", getFoods);

export default router;
