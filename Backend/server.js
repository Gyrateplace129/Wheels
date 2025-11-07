import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import travelRoutes from "./routes/travel.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// 🔥 IMPORTANTE → Permitir FRONTEND en Vercel
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://wheels-frontend.vercel.app" // <-- Se actualizará cuando deployes
  ],
  credentials: true,
}));

// Prefijo de API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/travel", travelRoutes);

app.get("/", (req, res) => res.send("✅ API funcionando correctamente"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("🚀 Servidor listo en puerto", PORT));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/travel", travelRoutes);


