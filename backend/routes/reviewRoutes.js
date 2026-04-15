import express from "express";
import { getTailorReviews } from "../controllers/reviewControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/tailor", getTailorReviews);

export default router;
