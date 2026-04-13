import express from "express";
import {
  getProfessionals,
  getProfessionalById,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/professionals", protect, getProfessionals);
router.get("/professional/:id", protect, getProfessionalById);

export default router;
