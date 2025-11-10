import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("passenger"); // passenger | driver
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    universityId: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [vehicle, setVehicle] = useState({
    plate: "",
    capacity: 1,
    brand: "",
    model: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onVehicleChange = (e) =>
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        role,
      };

      if (role === "driver") {
        payload.vehicle = vehicle;
      }

      const res = await api.post("/auth/register", payload);

      if (!res.data.success) {
        alert(res.data.message || "No se pudo registrar");
        return;
      }

      alert("✅ Registro exitoso. Ahora inicia sesión.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error en la red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg border border-slate-200 rounded-xl p-6 space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-600 select-none">
          Crear cuenta
        </h1>

        {/* Selector de rol */}
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => setRole("passenger")}
            className={`px-4 py-2 rounded-md border ${
              role === "passenger"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Pasajero
          </button>

          <button
            type="button"
            onClick={() => setRole("driver")}
            className={`px-4 py-2 rounded-md border ${
              role === "driver"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Conductor
          </button>
        </div>

        {/* Campos generales */}
        <div className="grid grid-cols-2 gap-2">
          <input
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={onChange}
            required
            className="border p-2 rounded-md"
          />

          <input
            name="surname"
            placeholder="Apellido"
            value={form.surname}
            onChange={onChange}
            required
            className="border p-2 rounded-md"
          />
        </div>

        <input
          name="universityId"
          placeholder="ID de estudiante"
          value={form.universityId}
          onChange={onChange}
          required
          className="border p-2 w-full rounded-md"
        />

        <input
          name="email"
          type="email"
          placeholder="Correo institucional"
          value={form.email}
          onChange={onChange}
          required
          className="border p-2 w-full rounded-md"
        />

        <input
          name="contactNumber"
          placeholder="Teléfono"
          value={form.contactNumber}
          onChange={onChange}
          required
          className="border p-2 w-full rounded-md"
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña (mínimo 8 caracteres)"
          value={form.password}
          onChange={onChange}
          required
          className="border p-2 w-full rounded-md"
        />

        {/* Campos del vehículo (solo si conductor) */}
        {role === "driver" && (
          <div className="border border-slate-300 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-slate-700">Datos del vehículo</h3>

            <input
              name="plate"
              placeholder="Placa"
              value={vehicle.plate}
              onChange={onVehicleChange}
              required
              className="border p-2 w-full rounded-md"
            />

            <input
              name="capacity"
              type="number"
              min="1"
              max="6"
              placeholder="Capacidad (número de asientos)"
              value={vehicle.capacity}
              onChange={onVehicleChange}
              required
              className="border p-2 w-full rounded-md"
            />

            <input
              name="brand"
              placeholder="Marca"
              value={vehicle.brand}
              onChange={onVehicleChange}
              required
              className="border p-2 w-full rounded-md"
            />

            <input
              name="model"
              placeholder="Modelo"
              value={vehicle.model}
              onChange={onVehicleChange}
              required
              className="border p-2 w-full rounded-md"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Registrar"}
        </button>

        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
