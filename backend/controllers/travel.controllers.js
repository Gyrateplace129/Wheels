import Travel from "../models/travels.js";
import User from "../models/user.js";

// Crear un viaje nuevo (solo conductores)
export const createTravel = async (req, res) => {
  try {
    const { startPoint, endPoint, route, departureTime, availableSeats, fare } = req.body;

    if (!startPoint || !endPoint || !departureTime || !availableSeats || !fare) {
      return res.status(400).json({ success: false, message: "Faltan datos del viaje" });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "driver") {
      return res.status(403).json({ success: false, message: "Solo los conductores pueden crear viajes" });
    }

    const travel = await Travel.create({
      driver: user._id,
      startPoint,
      endPoint,
      route,
      departureTime,
      availableSeats,
      fare,
    });

    res.status(201).json({
      success: true,
      message: "Viaje creado correctamente",
      travel,
    });
  } catch (error) {
    console.error("Error creando viaje:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// Obtener viajes disponibles para pasajeros
export const getAvailableTravels = async (req, res) => {
  try {
    const { seats, startPoint } = req.query;

    // filtro base
    const filter = { availableSeats: { $gt: 0 } };
    if (seats) filter.availableSeats = { $gte: Number(seats) };
    if (startPoint) filter.startPoint = { $regex: startPoint, $options: "i" };

    const travels = await Travel.find(filter)
      .populate("driver", "name surname email contactNumber")
      .sort({ departureTime: 1 });

    res.json({ success: true, travels });
  } catch (error) {
    console.error("Error obteniendo viajes:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// Reservar asientos en un viaje
export const reserveTravel = async (req, res) => {
  try {
    const { travelId, seats, pickupPoint } = req.body;

    const travel = await Travel.findById(travelId);
    if (!travel) return res.status(404).json({ success: false, message: "Viaje no encontrado" });

    if (travel.availableSeats < seats) {
      return res.status(400).json({ success: false, message: "No hay suficientes asientos disponibles" });
    }

    // Actualizar número de asientos disponibles
    travel.availableSeats -= seats;
    await travel.save();

    res.json({
      success: true,
      message: `Reserva realizada con éxito (${seats} asiento${seats > 1 ? "s" : ""})`,
      travel,
    });
  } catch (error) {
    console.error("Error al reservar viaje:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};
