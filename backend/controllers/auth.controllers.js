import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Vehicle from "../models/vehicles.js";

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { name, surname, universityId, email, contactNumber, password, role, vehicle } = req.body;

    if (!name || !surname || !email || !contactNumber || !password) {
      return res.status(400).json({ success: false, message: "Campos obligatorios faltantes" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    let vehicleDoc = null;
    if (role === "driver" && vehicle) {
      const plateExists = await Vehicle.findOne({ plate: vehicle.plate });
      if (plateExists) {
        return res.status(409).json({ success: false, message: "Placa ya registrada" });
      }
      vehicleDoc = await Vehicle.create(vehicle);
    }

    const newUser = await User.create({
      name,
      surname,
      universityId,
      email,
      contactNumber,
      password: hashed,
      role,
      vehicle: vehicleDoc ? vehicleDoc._id : null,
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Obtener información del usuario actual
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("vehicle");
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
