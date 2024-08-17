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
    timeSpent: { type: String },
    deliveryNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryNote",
      default: null, // Initially null until a delivery note is added
    },
    invoiceNumber: {type: String, default: null},
  },
  { timestamps: true }
);

// Middleware to calculate time spent on the trip before saving
tripSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    // Calculate the duration in minutes and round to the nearest minute
    let durationInMinutes = Math.round(
      (new Date(this.endTime) - new Date(this.startTime)) / 1000 / 60
    );

    // Check if the duration is more than 60 minutes
    if (durationInMinutes >= 60) {
      // Convert to hours and minutes
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      this.timeSpent = `${hours} hour(s) and ${minutes} minute(s)`;
    } else {
      // If less than 60 minutes, keep it in minutes
      this.timeSpent = `${durationInMinutes} minute(s)`;
    }
  }
  next();
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
