import User from "../models/user.js";
import Vehicle from "../models/vehicles.js";

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("vehicle");
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role,
        vehicle: user.vehicle || null,
      },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    const { name, surname, email, contactNumber, role, vehicle } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    // Actualizar campos básicos
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (contactNumber) user.contactNumber = contactNumber;

    // Si el rol cambia a driver y se envía vehículo, actualizar/crear vehículo
    if (role === "driver") {
      if (vehicle) {
        if (user.vehicle) {
          // actualizar el vehículo existente
          await Vehicle.findByIdAndUpdate(user.vehicle, vehicle, { new: true });
        } else {
          // crear uno nuevo
          const newVehicle = await Vehicle.create(vehicle);
          user.vehicle = newVehicle._id;
        }
      }
      user.role = "driver";
    } else if (role === "passenger") {
      user.role = "passenger";
      user.vehicle = null; // eliminar relación si deja de ser conductor
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate("vehicle");

    res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};
