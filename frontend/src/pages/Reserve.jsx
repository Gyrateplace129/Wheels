import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Reserve() {
  const { id } = useParams(); // travelId
  const navigate = useNavigate();

  const [travel, setTravel] = useState(null);
  const [seats, setSeats] = useState(1);
  const [pickupPoint, setPickupPoint] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchTravel() {
    try {
      const res = await api.get(`/travel/available`);
      const found = res.data.items.find((t) => t._id === id);
      setTravel(found || null);
    } catch (err) {
      alert("Error cargando el viaje.");
      navigate("/");
    }
  }

  async function handleReserve(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/travel/reserve", {
        travelId: id,
        seats,
        pickupPoint,
      });

      if (!res.data.success) {
        alert(res.data.message || "Error al reservar.");
        return;
      }

      alert("✅ Reserva realizada con éxito.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error del servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTravel();
  }, []);

  if (!travel) return <div className="text-center mt-10 text-slate-600">Cargando viaje...</div>;

  return (
    <div className="max-w-lg mx-auto mt-6 bg-white shadow-lg border border-slate-200 p-6 rounded-xl space-y-5">
      <h1 className="text-2xl font-bold text-indigo-600 text-center">
        Reservar viaje
      </h1>

      <div>
        <p className="text-lg font-semibold">
          {travel.startPoint} → {travel.endPoint}
        </p>
        <p className="text-sm text-slate-500">
          Sale: {new Date(travel.departureTime).toLocaleString()}
        </p>
        <p className="text-sm">
          Tarifa: S/ {travel.fare} • Cupos disponibles:{" "}
          <span className="font-semibold text-green-600">{travel.availableSeats}</span>
        </p>
      </div>

      <form onSubmit={handleReserve} className="space-y-4">
        <input
          type="text"
          placeholder="Punto de recogida"
          value={pickupPoint}
          onChange={(e) => setPickupPoint(e.target.value)}
          required
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="number"
          min="1"
          max={travel.availableSeats}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          required
          className="border p-2 rounded-lg w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Reservando..." : "Confirmar reserva"}
        </button>
      </form>
    </div>
  );
}
