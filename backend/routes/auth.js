import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../jwt.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const user = new User({ firstName, lastName, username, email, password });
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = createToken(user);
      res.send({ success: true, token: token });
      return;
    }
    res.send({ success: false, message: "Invalid email or password" });
  } catch (error) {
    res.send({ success: false, me_nssage: error.message });
  }
});

export default router;
