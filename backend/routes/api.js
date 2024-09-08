import express from "express";
import auth from "./auth.js";
import post from "./post.js";
import community from "./community.js";
import comment from "./comment.js";
import user from "./user.js";

const router = express.Router();

router.use("/", auth);
router.use("/post", post);
router.use("/community", community);
router.use("/comments", comment);
router.use("/user", user);

export default router;
