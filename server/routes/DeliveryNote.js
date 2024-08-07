const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const DeliveryNote = require("../models/DeliveryNoteModel");
const multer = require("multer");
const { verify } = require("../middleware/auth");

const router = express.Router();

const MINDEE_OCR_API_KEY = process.env.MINDEE_OCR_API_KEY;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", async (req, res) => {
  const { document } = req.body;
  const { name, type, content } = document;

  // Save the Base64 content to a file
  const filePath = `uploads/${Date.now()}-${name}`;
  fs.writeFileSync(filePath, content, { encoding: "base64" });

  try {
    const form = new FormData();
    form.append("document", fs.createReadStream(filePath));

    const response = await axios.post(
      "https://api.mindee.net/v1/products/wamae/delivery_note/v1/predict_async",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Token ${MINDEE_OCR_API_KEY}`,
        },
      }
    );

    const jobId = response.data.job.id;
    res.status(200).json({ jobId });
  } catch (error) {
    console.error("OCR processing error:", error);
    res
      .status(500)
      .json({ message: "OCR processing failed", error: error.message });
  } finally {
    fs.unlinkSync(filePath); // Clean up uploaded file
  }
});

router.get("/status/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  const pollInterval = 5000; // Interval between polls in milliseconds
  const maxRetries = 3; // Maximum number of retries

  try {
    let attempts = 0;
    let response;
    let status = "";

    // Polling loop
    while (status !== "completed" && attempts < maxRetries) {
      response = await axios.get(
        `https://api.mindee.net/v1/products/wamae/delivery_note/v1/documents/queue/${jobId}`,
        {
          headers: {
            Authorization: `Token ${MINDEE_OCR_API_KEY}`,
          },
        }
      );

      status = response.data.job.status;

      if (status !== "completed") {
        attempts++;
        console.log(
          `Job status: ${status}. Attempt ${attempts}/${maxRetries}. Retrying in ${
            pollInterval / 1000
          } seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, pollInterval)); // Wait before retrying
      }
    }

    if (status !== "completed") {
      return res.status(400).json({ message: "Job did not complete in time" });
    }

     const {
       date,
       delivery_notes_number,
       number_of_delivery_notes,
       driver_name,
       loaders_names,
       transporter_name,
       transporter_sequence_route,
       vehicle_registration_no,
       total,
     } = response.data.document.inference.prediction;

    res.status(200).json({
      date: date?.value || "",
      vehicleRegistrationNumber: vehicle_registration_no?.value || "",
      transporterName: transporter_name?.value || "",
      driverName: driver_name?.value || "",
      loadersName: loaders_names?.map((loader) => loader.value) || [],
      transporterSequenceRoute: transporter_sequence_route?.value || "",
      numberOfDeliveryNotes: number_of_delivery_notes?.value || "",
      deliveryNotesNumber:
        delivery_notes_number?.map((note) => parseInt(note.value, 10)) || [],
      total: total?.value || "",
    });
  } catch (error) {
    console.error("Error retrieving job status:", error);
    res
      .status(500)
      .json({ message: "Error retrieving job status", error: error.message });
  }
});

router.post("/create", verify, async (req, res) => {
  const {
    date,
    vehicleRegistrationNumber,
    transporterName,
    driverName,
    loadersName,
    transporterSequenceRoute,
    numberOfDeliveryNotes,
    deliveryNotesNumber,
    total,
    fileRef,
  } = req.body;
  try {
    const deliveryNote = new DeliveryNote({
      user: req.user.id,
      date,
      vehicleRegistrationNumber,
      transporterName,
      driverName,
      loadersName,
      transporterSequenceRoute,
      numberOfDeliveryNotes,
      deliveryNotesNumber,
      total,
      fileRef
    });

    await deliveryNote.save();
    res.status(201).json(deliveryNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route to get deliveries
router.get('/', verify, async (req, res) => {
  const { search, sort } = req.query;
  const isAdmin = req.user.role === 'admin';
  const searchQuery = {};

  if (!isAdmin) {
    searchQuery.user = req.user.id;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    searchQuery.$or = [
      { driverName: regex },
      { vehicleRegistrationNumber: regex },
      { loadersName: { $elemMatch: { $regex: regex } } },
      { deliveryNotesNumber: { $elemMatch: { $regex: regex } } },
    ];
  }

  try {
    const deliveries = await DeliveryNote.find(searchQuery)
      .select('createdAt deliveryNotesNumber driverName loadersName fileRef')
      .sort({ createdAt: sort === 'asc' ? 1 : -1 }); // Default to newest first (desc)

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get delivery by ID
router.get("/:id", verify, async (req, res) => {
  const { id } = req.params;
  try {
    const deliveryNote = await DeliveryNote.findById(id);
    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }
    res.status(200).json(deliveryNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a delivery note
router.put("/:id", verify, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Find the delivery note by ID
    const deliveryNote = await DeliveryNote.findById(id);

    // Check if the delivery note exists
    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    // Check if the user is the owner of the delivery note
    if (deliveryNote.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this delivery note" });
    }

    // Update the delivery note fields
    const {
      date,
      vehicleRegistrationNumber,
      transporterName,
      driverName,
      loadersName,
      transporterSequenceRoute,
      numberOfDeliveryNotes,
      deliveryNotesNumber,
      total,
      fileRef
    } = req.body;

    if (date !== undefined) deliveryNote.date = date;
    if (vehicleRegistrationNumber !== undefined) deliveryNote.vehicleRegistrationNumber = vehicleRegistrationNumber;
    if (transporterName !== undefined) deliveryNote.transporterName = transporterName;
    if (driverName !== undefined) deliveryNote.driverName = driverName;
    if (loadersName !== undefined) deliveryNote.loadersName = loadersName;
    if (transporterSequenceRoute !== undefined) deliveryNote.transporterSequenceRoute = transporterSequenceRoute;
    if (numberOfDeliveryNotes !== undefined) deliveryNote.numberOfDeliveryNotes = numberOfDeliveryNotes;
    if (deliveryNotesNumber !== undefined) deliveryNote.deliveryNotesNumber = deliveryNotesNumber;
    if (total !== undefined) deliveryNote.total = total;
    if (fileRef !== undefined) deliveryNote.fileRef = fileRef;

    // Save the updated delivery note
    await deliveryNote.save();

    res.status(200).json(deliveryNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a delivery note
router.delete("/:id", verify, async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role;

  try {
    // Check if the user is an admin
    if (userRole !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to delete this delivery note" });
    }

    // Find and delete the delivery note by ID
    const deliveryNote = await DeliveryNote.findByIdAndDelete(id);

    // Check if the delivery note exists
    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    res.status(200).json({ message: "Delivery note deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery note:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
