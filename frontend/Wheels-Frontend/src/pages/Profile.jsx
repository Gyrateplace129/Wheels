import { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthProvider";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    contactNumber: user?.contactNumber || "",
  });

  const [vehicle, setVehicle] = useState(
    user?.role === "driver"
      ? {
          plate: user.vehicle?.plate || "",
          capacity: user.vehicle?.capacity || 1,
          brand: user.vehicle?.brand || "",
          model: user.vehicle?.model || "",
        }
      : null
  );

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onVehicleChange = (e) =>
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (user.role === "driver" && vehicle) payload.vehicle = vehicle;

      const res = await api.put("/user/profile", payload);

      if (!res.data.success) {
        alert(res.data.message || "No se pudo actualizar.");
        return;
      }

      alert("✅ Perfil actualizado.");
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Error en el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg border border-slate-200 rounded-xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600 text-center">
        Mi Perfil
      </h1>

      {/* Información personal */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Nombre"
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            name="surname"
            value={form.surname}
            onChange={onChange}
            placeholder="Apellido"
            className="border p-2 rounded-md w-full"
            required
          />
        </div>

        <input
          name="contactNumber"
          value={form.contactNumber}
          onChange={onChange}
          placeholder="Teléfono"
          className="border p-2 rounded-md w-full"
          required
        />

        <p className="text-sm text-slate-500">
          Rol actual: <span className="font-semibold">{user.role === "driver" ? "Conductor" : "Pasajero"}</span>
        </p>

        {/* Sección de vehículo si es conductor */}
        {user.role === "driver" && (
          <div className="border border-slate-300 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-slate-700">Datos del vehículo</h3>

            <input
              name="plate"
              value={vehicle.plate}
              onChange={onVehicleChange}
              placeholder="Placa"
              className="border p-2 rounded-md w-full"
              required
            />
            <input
              name="capacity"
              type="number"
              min="1"
              max="6"
              value={vehicle.capacity}
              onChange={onVehicleChange}
              placeholder="Capacidad"
              className="border p-2 rounded-md w-full"
              required
            />
            <input
              name="brand"
              value={vehicle.brand}
              onChange={onVehicleChange}
              placeholder="Marca"
              className="border p-2 rounded-md w-full"
              required
            />
            <input
              name="model"
              value={vehicle.model}
              onChange={onVehicleChange}
              placeholder="Modelo"
              className="border p-2 rounded-md w-full"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition disabled:opacity-50"
        >
          {loading ? "Guardando cambios..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
