import express from "express";
import {
  registerCustomer,
  registerTailor,
  registerDesigner,
  loginUser,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/tailor", registerTailor);
router.post("/register/designer", registerDesigner);
router.post("/login", loginUser);

export default router;
