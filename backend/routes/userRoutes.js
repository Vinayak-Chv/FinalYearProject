import express from "express";
import {
  getProfessionals,
  getProfessionalById,
  getMyProfile,
  updateMyProfile,
  getMyMeasurements,
  saveMyMeasurements,
  changeMyPassword,
  deleteMyAccount,
} from "../controllers/userControllers.js";
import { getProfessionalReviews } from "../controllers/reviewControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/professionals", protect, getProfessionals);
router.get("/professional/:id/reviews", protect, getProfessionalReviews);
router.get("/professional/:id", protect, getProfessionalById);

router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

router.get("/measurements", protect, getMyMeasurements);
router.put("/measurements", protect, saveMyMeasurements);

router.put("/change-password", protect, changeMyPassword);
router.delete("/me", protect, deleteMyAccount);

export default router;
