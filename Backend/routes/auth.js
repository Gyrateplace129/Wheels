import express from "express";
import { registerUser } from "sebastian quintero venegas/Desarrollo Web/Wheels/Backend/controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

export default router;
