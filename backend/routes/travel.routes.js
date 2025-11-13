import { Router } from "express";
import { createTravel, getAvailableTravels, reserveTravel } from "../controllers/travel.controllers.js";
import verifyToken from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/create", verifyToken, createTravel);
router.get("/available", getAvailableTravels);
router.post("/reserve", verifyToken, reserveTravel);

export default router;
