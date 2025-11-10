import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function Layout({ children }) {
  const { user, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div>
            <Link to="/" className="text-2xl font-bold text-indigo-600">Wheels</Link>
            <div className="text-sm text-slate-500">Compartir rutas universitarias</div>
          </div>

          <nav className="flex items-center gap-3">
            <Link to="/" className="text-slate-700">Viajes</Link>
            {user && user.role === "driver" && <Link to="/create" className="text-slate-700">Crear viaje</Link>}
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline">Iniciar sesión</Link>
                <Link to="/register" className="btn btn-primary">Registro</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="text-slate-700">Hola, <strong>{user.name}</strong></Link>
                <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
