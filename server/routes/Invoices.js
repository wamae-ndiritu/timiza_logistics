const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const { Document, Invoice } = require("../models/Invoice");

const router = express.Router();

const MINDEE_OCR_API_KEY = process.env.MINDEE_OCR_API_KEY;

// Endpoint to handle image upload and OCR processing
router.post("/upload", async (req, res) => {
  const fileUrl = req.body.fileUrl;
  try {
    // Prepare form-data
    const form = new FormData();
    form.append("document", fs.createReadStream(fileUrl));

    const { data } = await axios.post(
      "https://api.mindee.net/v1/products/mindee/invoices/v4/predict",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Token ${MINDEE_OCR_API_KEY}`,
        },
      }
    );

    const customerName = data.document.inference.prediction.customer_name.value;
    const customerAddress =
      data.document.inference.prediction.customer_address.value;
    const invoiceDate = data.document.inference.prediction.date.value;
    const invoiceDueDate = data.document.inference.prediction.due_date.value;
    const invoiceNumber =
      data.document.inference.prediction.invoice_number.value;
    const supplierName = data.document.inference.prediction.supplier_name.value;
    const supplierAddress =
      data.document.inference.prediction.supplier_address.value ||
      data.document.inference.prediction.supplier_email.value;
    const supplierPhoneNumber =
      data.document.inference.prediction.supplier_phone_number.value;
    const invoiceAmount = data.document.inference.prediction.total_amount.value;

    // Save document URL
    const document = new Document({ url: imagePath });
    await document.save();

    // Save invoice data
    const invoice = new Invoice({
      invoiceNumber,
      invoiceDate,
      invoiceDueDate,
      invoiceAmount,
      customerName,
      customerAddress,
      supplierName,
      supplierAddress,
      supplierPhoneNumber,
      document: document._id,
    });
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    console.error("OCR processing error:", error);
    res
      .status(500)
      .json({ message: "OCR processing failed", error: error.message });
  }
});

module.exports = router;
