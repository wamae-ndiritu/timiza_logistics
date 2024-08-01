const mongoose = require("mongoose");

const deliveryNoteSchema = new mongoose.Schema(
  {
    data: {type: String},
    vehicleRegistrationNumber: {type: String},
    transporterName: {type: String},
    driverName: {type: String},
    loadersName: {type: [String]},
    transporterSequenceRoute: {type: String},
    deliveryNotesNumber: {type: [Number]},
    total: {type: String}

  },
  { timestamps: true }
);

const DeliveryNote = mongoose.model("DeliveryNote", deliveryNoteSchema);

module.exports = DeliveryNote;
