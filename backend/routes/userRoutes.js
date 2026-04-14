import express from "express";
import {
  getProfessionals,
  getProfessionalById,
  getMyProfile,
  updateMyProfile,
  getMyMeasurements,
  saveMyMeasurements,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/professionals", protect, getProfessionals);
router.get("/professional/:id", protect, getProfessionalById);

router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

router.get("/measurements", protect, getMyMeasurements);
router.put("/measurements", protect, saveMyMeasurements);

export default router;
