const express = require("express");
const { verify, isAdmin } = require("../middleware/auth");
const Location = require("../models/LocationModel");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - type
 *         - name
 *         - branches
 *       properties:
 *         type:
 *           type: string
 *           description: The type of the location (e.g., Supermarket, Mall)
 *         name:
 *           type: string
 *           description: The name of the location (e.g., Carrefour, Naivas)
 *         branches:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the branch
 *               address:
 *                 type: string
 *                 description: Address of the branch
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude of the branch
 *                   lng:
 *                     type: number
 *                     description: Longitude of the branch
 *       example:
 *         type: "Supermarket"
 *         name: "Naivas"
 *         branches:
 *           - name: "Airport View"
 *             address: "Jomo Kenyatta Airport Road"
 *             coordinates:
 *               lat: -1.3207
 *               lng: 36.9266
 */

/**
 * @swagger
 * /locations/create:
 *   post:
 *     summary: Create a new location with branches
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: The location was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 location:
 *                   $ref: '#/components/schemas/Location'
 *       400:
 *         description: Bad request. Missing type, name, or branches
 *       500:
 *         description: Server error
 */

// Route to create a new location with its branches
router.post("/create", isAdmin, async (req, res) => {
    console.log("Creating called...")
  try {
    const { type, name, branches } = req.body;

    if (!type || !name || !branches || branches.length === 0) {
      return res.status(400).json({
        message: "Please provide type, name, and at least one branch.",
      });
    }

    const newLocation = new Location({
      type,
      name,
      branches,
    });

    await newLocation.save();

    res.status(201).json({
      message: "Location created successfully",
      location: newLocation,
    });

    console.log(newLocation)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @swagger
 * /locations/add-branch/{locationId}:
 *   put:
 *     summary: Add branches to an existing location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branches:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                         lng:
 *                           type: number
 *     responses:
 *       200:
 *         description: Branches added successfully
 *       400:
 *         description: Bad request. No branches provided
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */

// Route to add branches to an existing location
router.put("/:locationId/add-branch", isAdmin, async (req, res) => {
  try {
    const { locationId } = req.params;
    const { branches } = req.body;

    if (!branches || branches.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide branch details to add." });
    }

    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    location.branches.push(...branches);
    await location.save();

    res.status(200).json({
      message: "Branches added successfully",
      location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the branch
 *         address:
 *           type: string
 *           description: Address of the branch
 *         city:
 *           type: string
 *           description: City where the branch is located
 *           default: "Nairobi"
 *         coordinates:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *               description: Latitude of the branch
 *             lng:
 *               type: number
 *               description: Longitude of the branch
 *
 *     Location:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Type of location (Supermarket, Hypermarket, Mall)
 *         name:
 *           type: string
 *           description: Name of the location
 *         branches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Branch'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /locations:
 *   get:
 *     summary: Get all locations with branches
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Server error
 */

// Route to get all locations with branches
router.get('/', verify, async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});


/**
 * @swagger
 * /locations/{locationId}/branches:
 *   get:
 *     summary: Get all branches for a specific location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the location
 *     responses:
 *       200:
 *         description: A list of branches for the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */

// Route to get branches for a specific location by ID
router.get('/:locationId/branches', verify, async (req, res) => {
  try {
    const { locationId } = req.params;
    
    const location = await Location.findById(locationId);
    
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    
    res.status(200).json(location.branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @swagger
 * /locations/{locationId}/branches/{branchId}:
 *   delete:
 *     summary: Delete a specific branch in a location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the location
 *       - in: path
 *         name: branchId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the branch to delete
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Location or branch not found
 *       500:
 *         description: Server error
 */

// Route to delete a branch from a specific location by branchId
router.delete('/:locationId/branches/:branchId', isAdmin, async (req, res) => {
  try {
    const { locationId, branchId } = req.params;
    
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const branchIndex = location.branches.findIndex(branch => branch._id.toString() === branchId);
    if (branchIndex === -1) {
      return res.status(404).json({ message: "Branch not found" });
    }

    location.branches.splice(branchIndex, 1);  // Remove the branch from the array
    await location.save();

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @swagger
 * /locations/{locationId}:
 *   delete:
 *     summary: Delete a location along with all its branches
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the location to delete
 *     responses:
 *       200:
 *         description: Location and its branches deleted successfully
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */

// Route to delete the entire location with its branches
router.delete('/:locationId', isAdmin, async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findByIdAndDelete(locationId);
    
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({ message: "Location and its branches deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});




module.exports = router;
