import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  universityId: { type: String },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["driver", "passenger"], default: "passenger" },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
