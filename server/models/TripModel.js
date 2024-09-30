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
    startLocation: { type: String, required: true },

    // Updated to reference the Location model
    destinations: [
      {
        location: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Location",
          required: true,
        },
        reached: { type: Boolean, default: false },
        reachedAt: { type: Date, default: null },
        invoices: [
          {
            invoiceNumber: { type: String, required: true },
            accepted: { type: Boolean, default: false },
            rejected: { type: Boolean, default: false },
            delivered: { type: Boolean, default: false },
            rejectionReason: { type: String, default: null },
          },
        ],
      },
    ],
    timeSpent: { type: String },
    deliveryNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryNote",
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to calculate time spent on the trip
tripSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    let durationInMinutes = Math.round(
      (new Date(this.endTime) - new Date(this.startTime)) / 1000 / 60
    );

    if (durationInMinutes >= 60) {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      this.timeSpent = `${hours} hour(s) and ${minutes} minute(s)`;
    } else {
      this.timeSpent = `${durationInMinutes} minute(s)`;
    }
  }
  next();
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
