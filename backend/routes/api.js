import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;
    const user = new User({ first_name, last_name, username, email, password });
    await user.save();
    res.send({ message: "User registered successfully", success: true });
  } catch (error) {
    res.send({ message: Object.values(error.errors)[0].message, success: false });
  }
});

export default router;
