const express = require("express");
const { verify } = require("../middleware/auth");
const Vehicle = require("../models/VehicleModel");
const Trip = require("../models/TripModel");
const User = require("../models/User");

const router = express.Router();

// POST /trips/create - Create a new trip
router.post("/create", verify, async (req, res) => {
  try {
    const { startLocation, expectedDestination, invoiceNumber } = req.body;

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
      startTime: new Date(),
      startLocation: {
        type: "Point",
        coordinates: startLocation.coordinates, // [longitude, latitude]
      },
      expectedDestination,
      invoiceNumber,
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

// Complete a trip
router.post("/complete/:tripId", verify, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { endLocation } = req.body;

    // Validate input data
    if (!endLocation || !endLocation.coordinates) {
      return res.status(400).json({
        message: "End location is required.",
      });
    }

    // Find the trip by ID
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    // Ensure the trip is not already completed
    if (trip.endTime) {
      return res.status(400).json({ message: "Trip is already completed." });
    }

    // Set the end time and end location
    trip.endTime = new Date();
    trip.endLocation = {
      type: "Point",
      coordinates: endLocation.coordinates, // [longitude, latitude]
    };

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while completing the trip." });
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
        .populate("deliveryNote").sort({createdAt: -1});
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
        .populate("deliveryNote").sort({createdAt: -1});
    }

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while listing trips." });
  }
});


// Get trip by ID
router.get("/:id", verify, async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    let trip;

    if (userRole === "admin") {
      // If the user is an admin, fetch the trip by ID
      trip = await Trip.findById(id)
        .populate("vehicle")
        .populate("driver", "fullName email")
        .populate("loaders", "fullName email")
        .populate("deliveryNote");
    } else {
      // If the user is not an admin, fetch the trip only if the user is related to it
      trip = await Trip.findOne({
        _id: id,
        // $or: [
        //   { "vehicle.currentDriver": userId },
        //   { "vehicle.currentLoaders": { $in: [userId] } },
        // ],
      })
        .populate("vehicle")
        .populate("driver", "fullName email")
        .populate("loaders", "fullName email")
        .populate("deliveryNote");

      // If no trip is found or user is not related to the trip, deny access
      if (!trip) {
        return res.status(403).json({
          message: "You do not have access to this trip.",
        });
      }
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving the trip." });
  }
});


module.exports = router;