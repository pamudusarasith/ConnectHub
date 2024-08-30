import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;
    const user = new User({ first_name, last_name, username, email, password });
    await user.save();
    res.send({ success: true, message: "User registered successfully" });
  } catch (error) {
    if (error.name == "ValidationError") {
      res.send({
        success: false,
        message: Object.values(error.errors)[0].message,
      });
    } else {
      res.send({ success: false, message: error.message });
    }
  }
});

export default router;
