require("dotenv").config();
const express = require("express");
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./routes/Users');
const invoiceRouter = require("./routes/Invoices.js");
const deliveryRouter = require("./routes/DeliveryNote");
const vehicleRouter = require("./routes/Vehicle");
const { connectDatabase } = require("./config/db");


// Database
connectDatabase();

// Middleware
// Increase the limit to 10mb (for example)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors())


// API calls
app.use('/api/v1/users', userRouter);
app.use("/api/v1/deliveries", deliveryRouter);
app.use("/api/v1/vehicles", vehicleRouter);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
