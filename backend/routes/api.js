import express from "express";
import auth from "./auth.js";
import post from "./post.js";
import community from "./community.js";

const router = express.Router();

router.use("/", auth);
router.use("/post", post);
router.use("/community", community);

export default router;
