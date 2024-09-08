import express from "express";
import bcrypt from "bcrypt"; // For hashing passwords
import User from "../models/User.js"; // Import the User model
import { authenticate } from "../jwt.js";

const router = express.Router();

// Route to get user details by userID
router.get("/", authenticate, async (req, res) => {
  try {
    // Fetch user details from the database by userID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Respond with user details (excluding sensitive data like password)
    res.send({
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Route to update user details
router.put("/", authenticate, async (req, res) => {
  try {
    const { firstName, lastName, username, oldPassword, password } = req.body;

    // Fetch the user from the database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Update user details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;

    // If password is being updated, validate the old password and hash the new one
    if (password) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).send({ success: false, message: "Old password is incorrect" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user back to the database
    await user.save();

    // Respond with the updated user details
    res.send({
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Route to delete user account
router.delete("/", authenticate, async (req, res) => {
  try {
    // Find and delete the user account by userID
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    // Respond with a success message
    res.send({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

export default router;
