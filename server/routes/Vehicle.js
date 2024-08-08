const express = require("express");
const { isAdmin, verify } = require("../middleware/auth");
const Vehicle = require("../models/VehicleModel");

const router = express.Router();

router.post("/create", isAdmin, async (req, res) => {
  try {
    const {
      vehicleMake,
      vehicleModel,
      chassisNumber,
      tonnageCategory,
      vehicleNumberPlate,
      notes,
      ownerName,
      ownerIdNumber,
      ownerLogBook,
    } = req.body;

    // Create a new vehicle instance
    const newVehicle = new Vehicle({
      vehicleMake,
      vehicleModel,
      chassisNumber,
      tonnageCategory,
      vehicleNumberPlate,
      notes,
      ownerName,
      ownerIdNumber,
      ownerLogBook,
    });

    // Save the vehicle to the database
    const savedVehicle = await newVehicle.save();

    // Respond with the saved vehicle
    res.status(201).json(savedVehicle);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating vehicle", error: error.message });
  }
});

// Get all vehicles (Admin only)
router.get("/", isAdmin, async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicles", error: error.message });
  }
});

// Get vehicle by ID
router.get("/:id", verify, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle", error: error.message });
  }
});

// Update vehicle by ID (Admin only)
router.put("/:id", verify, isAdmin, async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle", error: error.message });
  }
});

// Delete vehicle by ID (Admin only)
router.delete("/:id", verify, isAdmin, async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle", error: error.message });
  }
});

module.exports = router;

