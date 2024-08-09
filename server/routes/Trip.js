const express = require("express");
const { isAdmin, verify } = require("../middleware/auth");
const Vehicle = require("../models/VehicleModel");
const Trip = require("../models/TripModel");
const User = require("../models/User");

const router = express.Router();

// POST /trips - Create a new trip
router.post("/create", verify, async (req, res) => {
  try {
    const { vehicleId, driverId, loaderIds, startTime, startLocation } = req.body;

    // Validate input data
    if (!vehicleId || !driverId || !loaderIds || !startTime || !startLocation) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure vehicle, driver, and loaders exist
    const vehicle = await Vehicle.findById(vehicleId);
    const driver = await User.findById(driverId);
    const loaders = await User.find({ _id: { $in: loaderIds } });

    if (!vehicle || !driver || loaders.length !== loaderIds.length) {
      return res.status(404).json({ message: "Invalid vehicle, driver, or loaders." });
    }

    // Create a new Trip instance
    const trip = new Trip({
      vehicle: vehicle._id,
      driver: driver._id,
      loaders: loaders.map(loader => loader._id),
      startTime: new Date(startTime),
      startLocation: {
        type: "Point",
        coordinates: startLocation.coordinates, // [longitude, latitude]
      },
    });

    // Save the trip to the database
    await trip.save();

    // Add trip reference to vehicle
    vehicle.tripHistory.push(trip._id);
    await vehicle.save();

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the trip." });
  }
});


module.exports = router;