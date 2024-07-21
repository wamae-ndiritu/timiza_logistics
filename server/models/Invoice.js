const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

const Document = mongoose.model('Document', DocumentSchema);

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: String },
  invoiceDueDate: { type: String },
  invoiceAmount: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String },
  supplierName: { type: String, required: true },
  supplierAddress: { type: String },
  supplierPhoneNumber: { type: String },
  document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = {Invoice, Document}