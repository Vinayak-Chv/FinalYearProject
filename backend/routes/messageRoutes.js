import express from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/conversation", getOrCreateConversation);
router.get("/conversations", getUserConversations);
router.get("/:conversationId", getMessages);
router.post("/send", sendMessage);

export default router;
