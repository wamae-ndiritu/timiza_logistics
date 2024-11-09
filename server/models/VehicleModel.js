const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    chassisNumber: { type: String, unique: true, required: true },
    tonnageCategory: { type: String, required: true },
    vehicleNumberPlate: { type: String, unique: true, required: true },
    notes: { type: String },
    ownerName: { type: String, required: true },
    ownerIdNumber: { type: String, required: true },
    ownerLogBook: { type: String, default: null },
    currentDriver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    currentLoaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    driverHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    loaderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
