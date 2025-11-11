import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controllers.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas protegidas
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
