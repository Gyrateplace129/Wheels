import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/travels");
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d12] text-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#151520] border border-[#3b3b5a]/30">
        <h2 className="text-3xl font-bold text-center mb-6 text-violet-400">
          Wheels 🚗✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Correo</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-[#1e1e2a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@universidad.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-[#1e1e2a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-violet-600 hover:bg-violet-700 transition-all rounded-lg text-lg font-bold shadow-[0_0_12px_#6d28d9]"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
