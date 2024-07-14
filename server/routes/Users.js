const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");
const Loader = require("../models/Loader");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

// User login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user by email
    let user;
    let isMatch;
    if (role === "driver") {
      user = await Driver.findOne({ email }).populate("user");
    } else if (role === "loader") {
      user = await Loader.findOne({ email }).populate("user");
    } else {
      user = await User.findOne({ email, role: "admin" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "driver" || role === "loader" ) {
      isMatch = await user.user.comparePassword(password);
    } else {
      isMatch = await user.comparePassword(password);
    }

    // Check password
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create and return JWT token
    let payload = {};
    let userDetails = {};
    if (role === "driver" || role === "loader") {
      payload = {
        user: {
          id: user.user._id,
          email: user.user.email,
          role: user.user.role,
        },
      };
      userDetails = {
        _id: user._id,
        user: {
          id: user.user._id,
          email: user.user.email,
          role: user.user.role,
          createdAt: user.user.createdAt,
          updatedAt: user.user.updatedAt,
        },
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        nationalId: user.nationalId,
        drivingLicense: user.drivingLicense,
        nationalIdCopy: user.nationalIdCopy,
      };
    } else {
      payload = {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      };
      userDetails = {
        _id: user._id,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    }
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          token,
          userInfo: userDetails
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register/admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new User instance
    const newUser = new User({ email, password, role: "admin" });

    // Save the user (password will be hashed automatically)
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User registration route (accessible only by admins)
router.post("/register", isAdmin, async (req, res) => {
  const {
    email,
    password,
    role,
    fullName,
    phoneNumber,
    nationalId,
    drivingLicense,
  } = req.body;

  try {
    // Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new User instance
    const newUser = new User({ email, password, role });

    // Save the user (password will be hashed automatically)
    await newUser.save();

    // Create driver or loader profile based on role
    let newProfile;
    if (role === "driver") {
      newProfile = new Driver({
        user: newUser._id,
        fullName,
        email,
        phoneNumber,
        nationalId,
        drivingLicense,
      });
    } else if (role === "loader") {
      newProfile = new Loader({
        user: newUser._id,
        fullName,
        email,
        phoneNumber,
        nationalId,
        drivingLicense,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Save driver or loader profile
    await newProfile.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// List users
router.get('/', async (req, res) => {
  try {
    
  } catch (error) {
    
  }
})

module.exports = router;
