import express from "express";
import { registerCustomer, loginUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/login", loginUser);

export default router;
