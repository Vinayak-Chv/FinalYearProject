import express from "express";
import {
  createConsultation,
  getMyConsultations,
  getAllConsultations,
  updateConsultationStatus,
  respondToConsultation,
  getPendingRequests,
} from "../controllers/consultationControllers.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", createConsultation);
router.get("/my", getMyConsultations);
router.get("/pending", getPendingRequests); // for professionals
router.put("/:id/status", updateConsultationStatus);
router.put("/:id/respond", respondToConsultation);
router.get("/admin/all", admin, getAllConsultations);

export default router;
