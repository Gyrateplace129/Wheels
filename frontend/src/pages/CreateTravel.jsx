import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import api from "../api/axios";

export default function CreateTravel() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    startPoint: "",
    endPoint: "",
    route: "",
    departureTime: "",
    availableSeats: 1,
    fare: 0,
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Construir payload final
      const payload = {
        ...form,
        availableSeats: Number(form.availableSeats),
        fare: Number(form.fare),
        departureTime: new Date(form.departureTime).toISOString(),
      };

      const res = await api.post("/travel/create", payload);

      if (!res.data.success) {
        alert(res.data.message || "Error al crear el viaje.");
        return;
      }

      alert("✅ Viaje creado correctamente.");
      setForm({
        startPoint: "",
        endPoint: "",
        route: "",
        departureTime: "",
        availableSeats: 1,
        fare: 0,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error del servidor.");
    } finally {
      setLoading(false);
    }
  }

  // Si el usuario no es conductor, bloqueamos
  if (user?.role !== "driver") {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        ❌ Solo los conductores pueden crear viajes.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg border border-slate-200 rounded-xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600 text-center">
        Crear viaje
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="startPoint"
          placeholder="Punto de inicio"
          value={form.startPoint}
          onChange={onChange}
          required
          className="border p-2 rounded-md w-full"
        />

        <input
          name="endPoint"
          placeholder="Destino"
          value={form.endPoint}
          onChange={onChange}
          required
          className="border p-2 rounded-md w-full"
        />

        <input
          name="route"
          placeholder="Nombre de la ruta (opcional)"
          value={form.route}
          onChange={onChange}
          className="border p-2 rounded-md w-full"
        />

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Hora de salida</label>
          <input
            name="departureTime"
            type="datetime-local"
            value={form.departureTime}
            onChange={onChange}
            required
            className="border p-2 rounded-md w-full"
          />
        </div>

        <input
          name="availableSeats"
          type="number"
          min="1"
          max="6"
          placeholder="Cupos disponibles"
          value={form.availableSeats}
          onChange={onChange}
          required
          className="border p-2 rounded-md w-full"
        />

        <input
          name="fare"
          type="number"
          step="0.50"
          min="0"
          placeholder="Tarifa (S/)"
          value={form.fare}
          onChange={onChange}
          required
          className="border p-2 rounded-md w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 font-medium rounded-md transition disabled:opacity-50"
        >
          {loading ? "Creando viaje..." : "Crear viaje"}
        </button>
      </form>
    </div>
  );
}
