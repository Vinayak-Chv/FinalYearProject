import express from "express";
import {
  submitContact,
  getMessages,
} from "../controllers/contactControllers.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", submitContact); // User route to only submit data
router.get("/", protect, admin, getMessages); // Admin route to view the data

export default router;
