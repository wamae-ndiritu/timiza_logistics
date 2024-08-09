const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loaders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    startLocation: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    endLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
    expectedDestination: { type: String, required: true }, 
    timeSpent: { type: Number },
    deliveryNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryNote",
      default: null, // Initially null until a delivery note is added
    },
  },
  { timestamps: true }
);

// Middleware to calculate time spent on the trip before saving
tripSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    const duration =
      (new Date(this.endTime) - new Date(this.startTime)) / 1000 / 60; // in minutes
    this.timeSpent = duration;
  }
  next();
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
