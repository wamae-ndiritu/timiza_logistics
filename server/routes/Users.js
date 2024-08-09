const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");
const Loader = require("../models/Loader");
const { isAdmin, verify } = require("../middleware/auth");
const { generateRandomPassword, sendEmail } = require("../helpers");

const router = express.Router();

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user;
    let isMatch;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (foundUser.role === "driver") {
      user = await Driver.findOne({ email }).populate("user");
    }
    if (foundUser.role === "loader") {
      user = await Loader.findOne({ email }).populate("user");
    }

    if (foundUser.role === "admin") {
      user = foundUser;
    }

    if (foundUser.role === "driver" || foundUser.role === "loader") {
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
    if (foundUser.role === "driver" || foundUser.role === "loader") {
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
          fullName: user.user.fullName,
          isDefaultPassword: user.user.isDefaultPassword,
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
          nationalId: user.nationalId,
          fullName: user.fullName,
          isDefaultPassword: user.isDefaultPassword,
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
          ...userDetails,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register admin
router.post("/register/admin", async (req, res) => {
  const { email, password, nationalId, fullName } = req.body;

  try {
    // Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new User instance
    const newUser = new User({
      email,
      password,
      nationalId,
      fullName,
      role: "admin",
    });

    // Save the user (password will be hashed automatically)
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User registration route (accessible only by admins)
router.post("/register", isAdmin, async (req, res) => {
  const { email, role, fullName, phoneNumber, nationalId } = req.body;

  try {
    // Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate a random password
    const randomPassword = generateRandomPassword();

    // Create new User instance
    const newUser = new User({
      email,
      password: randomPassword,
      role,
      nationalId,
      fullName,
    });
    await newUser.save();

    // Create driver or loader profile based on role
    let newProfile;
    if (newUser.role === "driver") {
      newProfile = new Driver({
        user: newUser._id,
        fullName,
        email,
        phoneNumber,
        nationalId,
      });
    } else if (role === "loader") {
      newProfile = new Loader({
        user: newUser._id,
        fullName,
        email,
        phoneNumber,
        nationalId,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Save driver or loader profile
    await newProfile.save();

    // Send the random password to the user's email
    await sendEmail(
      email,
      "Login Credentials",
      `Your Timiza Login credentials are email: ${email} and initial password: ${randomPassword}. Please note you'll be required to reset this password for security purposes.`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin get all users
router.get("/", isAdmin, async (req, res) => {
  const type = req.query.type;
  const search = req.query.search;
  let usersList = [];
  if (search) {
    const user = await User.findOne({ nationalId: search });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user match the search criteria" });
    }
    if (user.role === "driver") {
      usersList = await Driver.find({ user: user._id }).populate("user");
    }
    if (user.role === "loader") {
      usersList = await Loader.find({ user: user._id }).populate("user");
    }
  } else {
    if (type === "drivers") {
      usersList = await Driver.find({}).populate("user").sort({ _id: -1 });
    } else if (type === "loaders") {
      usersList = await Loader.find({}).populate("user").sort({ _id: -1 });
    } else if (type === "admins") {
      usersList = await User.find({ role: "admin" }).sort({ _id: -1 });
    } else {
      const drivers = await Driver.find({}).populate("user").sort({ _id: -1 });
      const loaders = await Loader.find({}).populate("user").sort({ _id: -1 });
      usersList = [...drivers, ...loaders];
    }
  }
  res.status(200).json(usersList);
});

// Get a user by ID
router.get("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User get their profile
router.get("/profile", verify, async (req, res) => {
  const type = req.user.role;
  try {
    let user;

    if (type === "driver") {
      user = await Driver.findOne({ user: req.user.id }).populate("user");
    } else if (type === "loader") {
      user = await Loader.findOne({ user: req.user.id }).populate("user");
    } else {
      const user = User.findById(req.user.id);
      return res.status(200).json(user);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = {
      _id: user.user._id,
      email: user.user.email,
      role: user.user.role,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      nationalId: user.nationalId,
      drivingLicense: user.drivingLicense,
      nationalIdFront: user.nationalIdFront,
      nationalIdBack: user.nationalIdBack,
    };

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User update  their profile (password only)
router.put("/profile", verify, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password is correct
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Set the new password (it will be hashed by the pre-save hook)
    user.password = newPassword;
    user.isDefaultPassword = false;

    // Save the user with the updated password
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// User update nationalIdCopy and drivingLicenseCopy (normal user)
router.put("/profile/documents", verify, async (req, res) => {
  const { nationalIdFront, nationalIdBack, drivingLicenseCopy } = req.body;

  try {
    // Find the user by ID
    const type = req.user.role;
    let user;
    if (type === "driver") {
      user = await Driver.findOne({ user: req.user.id }).populate("user");
    } else if (type === "loader") {
      user = await Loader.findOne({ user: req.user.id }).populate("user");
    } else {
      return res
        .status(400)
        .json({ message: "Documents not required for admin!" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update documents

    user.nationalIdFront = nationalIdFront || user.nationalIdFront;
    user.nationalIdBack = nationalIdBack || user.nationalIdBack;
    user.drivingLicense = drivingLicenseCopy || user.drivingLicense;
    await user.save();

    console.log(user);

    res.status(200).json({ message: "Documents updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin update user profile (all details)
router.put("/profile/admin/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { fullName, email, role, phoneNumber, nationalId } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    // Update profile details based on role
    let profile;
    if (user.role === "driver") {
      profile = await Driver.findOne({ user: user._id });
      if (profile) {
        if (phoneNumber) profile.phoneNumber = phoneNumber;
        if (fullName) profile.fullName = fullName;
        if (nationalId) profile.nationalId = nationalId;
        await profile.save();
      }
    } else if (user.role === "loader") {
      profile = await Loader.findOne({ user: user._id });
      if (profile) {
        if (phoneNumber) profile.phoneNumber = phoneNumber;
        if (fullName) profile.fullName = fullName;
        if (nationalId) profile.nationalId = nationalId;
        await profile.save();
      }
    }
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin delete user
router.delete("/:id", isAdmin, async (req, res) => {
  const { type } = req.query;

  try {
    let user;
    if (type === "driver") {
      user = await Driver.findOne({ user: req.params.id }).populate("user");
      if (user) {
        await User.findByIdAndDelete(user.user._id);
        await Driver.findByIdAndDelete(req.params.id);
      }
    } else if (type === "loader") {
      user = await Loader.findOne({ user: req.params.id }).populate("user");
      if (user) {
        await User.findByIdAndDelete(user.user._id);
        await Loader.findByIdAndDelete(req.params.id);
      }
    } else {
      await User.findByIdAndDelete(req.params.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
