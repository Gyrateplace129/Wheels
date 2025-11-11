import { Router } from "express";

// ✅ OJO: ruta correcta hacia controllers (+ extensión .js y mayúsculas exactas)
import { register, login, me } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", me);

export default router;
