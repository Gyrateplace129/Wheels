import { useEffect, useState } from "react";
import api from "../api/axios";
import TravelCard from "../components/TravelCard";

export default function Travels() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startPoint: "",
    endPoint: "",
    seats: "",
  });

  async function fetchTravels() {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.startPoint) params.append("startPoint", filters.startPoint);
      if (filters.endPoint) params.append("endPoint", filters.endPoint);
      if (filters.seats) params.append("seats", filters.seats);

      const res = await api.get("/travel/available?" + params.toString());
      setTravels(res.data.items || []);
    } catch (err) {
      console.error(err);
      alert("Error cargando viajes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTravels();
  }, []);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border border-slate-200 space-y-3">
        <h2 className="text-lg font-semibold text-slate-700">Buscar viajes</h2>

        <div className="grid md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Punto de inicio"
            className="border p-2 rounded-md w-full"
            value={filters.startPoint}
            onChange={(e) =>
              setFilters({ ...filters, startPoint: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Destino"
            className="border p-2 rounded-md w-full"
            value={filters.endPoint}
            onChange={(e) =>
              setFilters({ ...filters, endPoint: e.target.value })
            }
          />
          <input
            type="number"
            min="1"
            placeholder="Cupos mínimos"
            className="border p-2 rounded-md w-full"
            value={filters.seats}
            onChange={(e) =>
              setFilters({ ...filters, seats: e.target.value })
            }
          />
          <button
            onClick={fetchTravels}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center text-slate-500">Cargando viajes...</div>
      ) : travels.length === 0 ? (
        <div className="text-center text-slate-500">No se encontraron viajes</div>
      ) : (
        <div className="space-y-4">
          {travels.map((travel) => (
            <TravelCard key={travel._id} travel={travel} />
          ))}
        </div>
      )}
    </div>
  );
}
