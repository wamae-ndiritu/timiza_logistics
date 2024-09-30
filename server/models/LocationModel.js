const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    default: "Nairobi",
  },
  coordinates: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: false, 
  },
});

// Define the Supermarket/Mall schema
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Supermarket", "Hypermarket", "Mall"], 
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  branches: [branchSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update 'updatedAt' before saving
locationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
