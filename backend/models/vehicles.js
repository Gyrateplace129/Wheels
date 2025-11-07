import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  plate: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  brand: String,
  model: String
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
