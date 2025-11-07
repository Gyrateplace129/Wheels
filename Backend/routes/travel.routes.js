import { Router } from "express";
import { createTravel, getAvailableTravels, reserveTravel } from "../controllers/travel.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyToken, createTravel);
router.get("/available", getAvailableTravels);
router.post("/reserve", verifyToken, reserveTravel);

export default router;
