const express = require("express");
const { verify } = require("../middleware/auth");
const Vehicle = require("../models/VehicleModel");
const Trip = require("../models/TripModel");
const User = require("../models/User");

const router = express.Router();

// POST /trips/create - Create a new trip
router.post("/create", verify, async (req, res) => {
  try {
    const { startLocation, destinations } = req.body;

    // Validate input data
    if (!startLocation || !destinations || destinations.length === 0) {
      return res
        .status(400)
        .json({
          message: "Start location and at least one destination are required.",
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

    // Create a new Trip instance with multiple destinations and associated invoices
    const trip = new Trip({
      vehicle: vehicle._id,
      driver: vehicle.currentDriver,
      loaders: vehicle.currentLoaders,
      startTime: new Date(),
      startLocation,
      destinations: destinations.map((destination) => ({
        location: destination.location,
        invoices: destination.invoices.map((invoiceNumber) => ({
          invoiceNumber,
          delivered: false, // Initially not delivered
          rejected: false, // Initially not rejected
        })),
      })),
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

// PATCH /trips/:tripId/destination/:destinationIndex/invoice/:invoiceNumber/accept
router.patch("/:tripId/destination/:destinationIndex/invoice/:invoiceNumber/accept", verify, async (req, res) => {
  try {
    const { tripId, destinationIndex, invoiceNumber } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    // Find the specific invoice within the destination
    const invoice = trip.destinations[destinationIndex].invoices.find(
      (inv) => inv.invoiceNumber === invoiceNumber
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Mark the invoice as accepted
    invoice.accepted = true;
    invoice.rejected = false;
    invoice.delivered = true;
    invoice.rejectionReason = null;

    // Save the trip with updated invoice status
    await trip.save();

    res.status(200).json({ message: "Invoice accepted successfully.", trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error accepting invoice." });
  }
});

// PATCH /trips/:tripId/destination/:destinationIndex/invoice/:invoiceNumber/reject
router.patch("/:tripId/destination/:destinationIndex/invoice/:invoiceNumber/reject", verify, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const { tripId, destinationIndex, invoiceNumber } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    // Find the specific invoice within the destination
    const invoice = trip.destinations[destinationIndex].invoices.find(
      (inv) => inv.invoiceNumber === invoiceNumber
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Reject the invoice and set rejection reason
    invoice.rejected = true;
    invoice.accepted = false;
    invoice.delivered = false;
    invoice.rejectionReason = rejectionReason || "No reason provided";

    // Save the trip with updated invoice information
    await trip.save();

    res.status(200).json({ message: "Invoice rejected successfully.", trip });
    console.log
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting invoice." });
  }
});


// PATCH /trips/:tripId/destination/:destinationIndex/complete
router.patch("/:tripId/destination/:destinationIndex/complete", verify, async (req, res) => {
  try {
    const { tripId, destinationIndex } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    // Mark the destination as reached and completed
    trip.destinations = trip.destinations.map((dest) => {
      if (dest._id.toString() === destinationIndex){
        return {
          ...dest,
          reached: true,
          reachedAt: new Date(),
        }
      }
      return dest;
    })

    // Save the updated trip
    await trip.save();

    res.status(200).json({ message: "Destination marked as completed.", trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error completing destination." });
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