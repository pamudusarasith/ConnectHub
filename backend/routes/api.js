import express from "express";
import auth from "./auth.js";
import post from "./post.js";

const router = express.Router();

router.use("/", auth);
router.use("/post", post);

export default router;
