import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthProvider";

export default function Login() {
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data.success) {
        alert(res.data.message || "Credenciales incorrectas");
        return;
      }

      // Guardar sesión
      setToken(res.data.token, res.data.user);
      setUser(res.data.user);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error en el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-5 border border-slate-200"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-600 select-none">
          Wheels
        </h1>
        <p className="text-center text-slate-500 text-sm -mt-3">Compartir viajes universitarios</p>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Correo institucional</label>
          <input
            type="email"
            className="w-full border border-slate-300 px-3 py-2 rounded-md focus:outline-indigo-600"
            placeholder="tu.correo@university.edu"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Contraseña</label>
          <input
            type="password"
            className="w-full border border-slate-300 px-3 py-2 rounded-md focus:outline-indigo-600"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-all disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className="text-center text-sm text-slate-500">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}
