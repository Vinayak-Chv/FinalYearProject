import express from "express";
import {
  getProducts,
  getProductId,
} from "../controllers/productControllers.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductId);

export default router;
