import express from "express";
import {
  getProfessionals,
  getProfessionalById,
  getMyProfile,
  updateMyProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/professionals", protect, getProfessionals);
router.get("/professional/:id", protect, getProfessionalById);

router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

export default router;
