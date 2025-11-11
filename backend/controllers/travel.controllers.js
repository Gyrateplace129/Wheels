import Travel from "../models/travel.js";

export const createTravel = async (req, res) => {
  try {
    const { origin, destination, date, seats, price } = req.body;

    const travel = await Travel.create({
      origin,
      destination,
      date,
      seats,
      price,
      driver: req.user.id
    });

    res.json({ message: "Viaje creado ✅", travel });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el viaje" });
  }
};

export const getTravels = async (req, res) => {
  try {
    const travels = await Travel.find().populate("driver", "name email");
    res.json(travels);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener viajes" });
  }
};
