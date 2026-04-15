import express from "express";
import {
  createOrder,
  getUserOrders,
  getTailorOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/tailor", getTailorOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;
