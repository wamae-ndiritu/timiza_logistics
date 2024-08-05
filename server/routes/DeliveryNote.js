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

    res.status(200).json(response.data.document.inference.prediction);
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
  } = req.body;
  try {
    const deliveryNote = new DeliveryNote({
      user: req.user._id,
      date,
      vehicleRegistrationNumber,
      transporterName,
      driverName,
      loadersName,
      transporterSequenceRoute,
      numberOfDeliveryNotes,
      deliveryNotesNumber,
      total,
    });

    await deliveryNote.save();
    res.status(201).json(deliveryNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
