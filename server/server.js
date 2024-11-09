require("dotenv").config();
const express = require("express");
const cors = require('cors')

const port = process.env.PORT || 3000;
const userRouter = require('./routes/Users');
const deliveryRouter = require("./routes/DeliveryNote");
const tripRouter = require("./routes/Trip");
const vehicleRouter = require("./routes/Vehicle");
const { connectDatabase } = require("./config/db");
const Vehicle = require("./models/VehicleModel.js");
const Driver = require("./models/Driver.js");
const Loader = require("./models/Loader.js");
const Trip = require("./models/TripModel.js");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const locationRouter = require("./routes/Location.js");

const app = express();

// Database
connectDatabase();


const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Logistics API",
      version: "1.0.0",
      description: "API for managing logistics operations",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI route
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); 
});

// Middleware
// Increase the limit to 10mb (for example)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors())


// API calls
app.use('/api/v1/users', userRouter);
app.use("/api/v1/deliveries", deliveryRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/trips", tripRouter);
app.use("/api/v1/locations", locationRouter);
app.get('/api/v1/stats', async (req, res) => {
  const vehicleCount = await Vehicle.countDocuments({isActive: true});
  const driverCount = await Driver.countDocuments({isActive: true});
  const loaderCount = await Loader.countDocuments({isActive: true});
  const tripCount = await Trip.countDocuments({isActive: true});
  return res.status(200).json({vehicleCount, driverCount, loaderCount, tripCount})

})

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
