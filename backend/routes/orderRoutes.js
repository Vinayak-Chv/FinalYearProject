import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderControllers.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", admin, updateOrderStatus);

export default router;
