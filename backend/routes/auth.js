import express from "express";
import { registerUser } from "sebastian quintero venegas/Desarrollo Web/Wheels/backend/controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", registerUser);

export default router;
