import express from "express";
import {
  registerCustomer,
  registerTailor,
  registerDesigner,
  saveTempProfile,
  attachProfile,
  loginUser,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/tailor", registerTailor);
router.post("/register/designer", registerDesigner);
router.post("/login", loginUser);
router.post("/temp-profile", saveTempProfile);
router.post("/attach-profile", protect, attachProfile);

export default router;
