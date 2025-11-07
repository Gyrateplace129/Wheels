import { Link } from "react-router-dom";

export default function TravelCard({ travel }) {
  const isFull = travel.availableSeats <= 0;

  return (
    <div className="bg-white p-4 shadow rounded-lg border border-slate-200 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-slate-700">
          {travel.startPoint} → {travel.endPoint}
        </h3>
        <p className="text-slate-500 text-sm">
          Sale: {new Date(travel.departureTime).toLocaleString()}
        </p>
        <p className="text-sm mt-1">
          Tarifa: S/ {travel.fare} • Cupos:{" "}
          <span className={isFull ? "text-red-600" : "text-green-600"}>
            {travel.availableSeats}
          </span>
        </p>
      </div>

      <Link to={`/reserve/${travel._id}`}>
        <button
          disabled={isFull}
          className={`px-4 py-2 rounded-md text-white transition ${
            isFull
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isFull ? "Lleno" : "Reservar"}
        </button>
      </Link>
    </div>
  );
}
