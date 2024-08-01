require("dotenv").config();
const express = require("express");
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./routes/Users');
const invoiceRouter = require("./routes/Invoices.js");
const { connectDatabase } = require("./config/db");


// Database
connectDatabase();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors())


// API calls
app.use('/api/v1/users', userRouter);
app.use("/api/v1/invoices", invoiceRouter);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
