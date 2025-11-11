import jwt from "jsonwebtoken";

/**
 * Middleware de autenticación con JWT.
 * - Lee el token desde Authorization: Bearer <token> o x-access-token
 * - Verifica con JWT_SECRET
 * - Inyecta req.user = { id, ...payload }
 */
export default function authMiddleware(req, res, next) {
  try {
    // 1) Obtener token
    let token = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // fallback opcional
    if (!token && req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    }

    if (!token) {
      return res.status(401).json({ message: "No autorizado: token requerido" });
    }

    // 2) Verificar token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("⚠️ Falta JWT_SECRET en variables de entorno");
      return res.status(500).json({ message: "Config del servidor incompleta" });
    }

    const decoded = jwt.verify(token, secret);

    // 3) Adjuntar usuario al request
    // Estructura típica del payload: { id: <userId>, iat, exp, ... }
    req.user = { id: decoded.id, ...decoded };

    return next();
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    return res.status(401).json({ message: "Token inválido" });
  }
}
