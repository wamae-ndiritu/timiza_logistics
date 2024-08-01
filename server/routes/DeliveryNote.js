const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const DeliveryNote = require("../models/DeliveryNoteModel");
const multer = require("multer");

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

router.post("/upload", upload.single("document"), async (req, res) => {
  const filePath = req.file.path;
  console.log(filePath)

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

  try {
    const response = await axios.get(
      `https://api.mindee.net/v1/products/wamae/delivery_note/v1/documents/queue/${jobId}`,
      {
        headers: {
          Authorization: `Token ${MINDEE_OCR_API_KEY}`,
        },
      }
    );

    const data = response.data;
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
    } = data.document.inference.prediction;

    // Create a new DeliveryNote document
    const deliveryNote = new DeliveryNote({
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

    // Save the document to the database
    await deliveryNote.save();

    res.status(200).json({ message: "Data saved successfully", deliveryNote });
  } catch (error) {
    console.error("Error retrieving job status:", error);
    res
      .status(500)
      .json({ message: "Error retrieving job status", error: error.message });
  }
});

module.exports = router;
