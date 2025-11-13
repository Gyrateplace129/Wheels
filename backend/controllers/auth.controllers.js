import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Vehicle from "../models/vehicles.js";

export const registerUser = async (req, res) => {
  try {
    const { name, surname, universityId, email, contactNumber, password, role, vehicle } = req.body;

    // Validación básica
    if (!name || !surname || !email || !contactNumber || !password)
      return res.status(400).json({ success: false, message: "Campos obligatorios faltantes" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(409).json({ success: false, code: "EMAIL_EXISTS", message: "El correo ya está registrado" });

    // Hashear contraseña
    const hashed = await bcrypt.hash(password, 10);

    let vehicleDoc = null;
    if (role === "driver" && vehicle) {
      // validar que la placa no esté en uso
      const plateExists = await Vehicle.findOne({ plate: vehicle.plate });
      if (plateExists) return res.status(409).json({ success: false, message: "Placa ya registrada" });
      vehicleDoc = await Vehicle.create(vehicle);
    }

    const newUser = await User.create({
      name, surname, universityId, email, contactNumber, password: hashed, role,
      vehicle: vehicleDoc ? vehicleDoc._id : null
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
