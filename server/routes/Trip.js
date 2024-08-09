const express = require("express");
const { isAdmin, verify } = require("../middleware/auth");
const Vehicle = require("../models/VehicleModel");
const Trip = require("../models/TripModel");
const User = require("../models/User");

const router = express.Router();

// POST /trips/create - Create a new trip
router.post("/create", verify, async (req, res) => {
  try {
    const { startLocation, expectedDestination } = req.body;

    // Validate input data
    if (!startLocation || !startLocation.coordinates || !expectedDestination) {
      return res
        .status(400)
        .json({
          message: "Start location and expected destination are required.",
        });
    }

    // Get the current user from the request (set by verify middleware)
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch the vehicle assigned to the current driver or loader
    let vehicle;
    if (userRole === "driver") {
      vehicle = await Vehicle.findOne({ currentDriver: userId });
    } else if (userRole === "loader") {
      vehicle = await Vehicle.findOne({ currentLoaders: { $in: [userId] } });
    }

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "No vehicle found for the current user." });
    }

    // Create a new Trip instance
    const trip = new Trip({
      vehicle: vehicle._id,
      driver: vehicle.currentDriver,
      loaders: vehicle.currentLoaders,
      startTime: new Date(), // Start time is set when the trip is created
      startLocation: {
        type: "Point",
        coordinates: startLocation.coordinates, // [longitude, latitude]
      },
      expectedDestination, // Add expected destination
    });

    // Save the trip to the database
    await trip.save();

    // Add trip reference to vehicle
    vehicle.tripHistory.push(trip._id);
    await vehicle.save();

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the trip." });
  }
});

// Get trips
router.get("/", verify, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let trips;

    if (userRole === "admin") {
      // If the user is an admin, list all trips
      trips = await Trip.find()
        .populate("vehicle")
        .populate("driver", "fullName email")
        .populate("loaders", "fullName email")
        .populate("deliveryNote");
    } else {
      // If the user is not an admin, list only their trips
      const vehicles = await Vehicle.find({
        $or: [{ currentDriver: userId }, { currentLoaders: { $in: [userId] } }],
      });

      const vehicleIds = vehicles.map((vehicle) => vehicle._id);

      trips = await Trip.find({ vehicle: { $in: vehicleIds } })
        .populate("vehicle")
        .populate("driver", "fullName email")
        .populate("loaders", "fullName email")
        .populate("deliveryNote");
    }

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while listing trips." });
  }
});


module.exports = router;