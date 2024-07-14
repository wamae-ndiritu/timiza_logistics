const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  loaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loader" }],
  timeStarted: { type: Date, default: Date.now },
  timeEnded: { type: Date },
  date: { type: Date, default: Date.now },
  invoiceNumber: { type: String },
  invoicesForShops: [{ shopName: String, invoiceNumber: String }],
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
