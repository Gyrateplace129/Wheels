import mongoose from "mongoose";

const travelSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Travel", travelSchema);
