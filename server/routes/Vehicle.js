const express = require("express");
const { isAdmin, verify } = require("../middleware/auth");
const Vehicle = require("../models/VehicleModel");
const User = require("../models/User");

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
    const vehicles = await Vehicle.find().sort({createdAt: -1});
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
router.delete("/:id", isAdmin, async (req, res) => {
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

// Assign a driver and/or loaders to a vehicle
router.post("/:id/assign-staff", isAdmin, async (req, res) => {
  try {
    const { driver, loaders } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    console.log("Vehicle found...")

    // Handle driver assignment
    if (driver) {
      const driverData = await User.findById(driver);
      if (!driverData) return res.status(404).json({ message: "Driver not found" });

      console.log("Driver found...")
      // Add the current driver to driver history if it exists and is not already in history
      if (vehicle.currentDriver && !vehicle.driverHistory.includes(vehicle.currentDriver)) {
        vehicle.driverHistory.push(vehicle.currentDriver);
      }

      // Assign the new driver
      vehicle.currentDriver = driverData._id;
    }

    // Handle loaders assignment
    if (loaders && loaders.length > 0) {
      const loaderData = await User.find({ _id: { $in: loaders } });
      if (loaderData.length !== loaders.length) return res.status(404).json({ message: "One or more loaders not found" });

      // Add the current loaders to loader history if they exist and are not already in history
      if (vehicle.currentLoaders && vehicle.currentLoaders.length > 0) {
        vehicle.currentLoaders.forEach((loader) => {
          if (!vehicle.loaderHistory.includes(loader)) {
            vehicle.loaderHistory.push(loader);
          }
        });
      }

      // Assign the new loaders
      vehicle.currentLoaders = loaders;
    }

    // Save the vehicle with updated driver and loader assignments
    await vehicle.save();

    console.log(vehicle)

    res.status(200).json({ message: "Staff assigned successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;

