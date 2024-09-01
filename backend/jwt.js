import jwt from "jsonwebtoken";
import User from "./models/User.js";

const secret = process.env.JWT_SECRET;

function createToken(user) {
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
  return token;
}

async function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.send({ success: false, message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.send({ success: false, message: "Invalid token" });
  }
}

async function maybeAuthenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    next();
  }
}

export { createToken, authenticate, maybeAuthenticate };
