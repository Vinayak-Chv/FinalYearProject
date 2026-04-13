import express from "express";
import { getProfessionals } from "../controllers/userControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/professionals", protect, getProfessionals);

export default router;
