import express from "express";
import upload from "../middleware/upload.js";
import { uploadAvatar } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protected route (for logged-in users)
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

// Public route (for registration – no auth required)
router.post("/public-avatar", upload.single("avatar"), uploadAvatar);

export default router;
