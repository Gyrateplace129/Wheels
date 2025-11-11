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

app.use(express.json());

// ✅ CORS CONFIG
app.use(cors({
  origin: [
    "http://localhost:5173",              // Desarrollo
    "https://wheels-kappa.vercel.app",    // Tu frontend en producción
  ],
  credentials: true,
}));

// ✅ Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/travel", travelRoutes);

// ✅ Ruta test
app.get("/", (req, res) => res.json({ message: "API funcionando correctamente ✅" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));
