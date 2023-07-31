import express from "express";
import { getLocalSpecialties } from "../controllers/localSpecialtyController";

const router = express.Router();

router.get("/", getLocalSpecialties);

export default router;
