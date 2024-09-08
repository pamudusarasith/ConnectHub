import express from "express";
import Comment from "../models/Comment.js";
import Community from "../models/Community.js";
import { authenticate } from "../jwt.js";
import Post from "../models/Post.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  console.log("Received request to create comment:", req.body);

  const { postId, text } = req.body;
  const post = await Post.findOne({ _id: postId });

  try {
    const comment = await Comment.create({
      post: post._id,
      text,
      author: req.user._id,
    });
    post.comments.push(comment);
    await post.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "comments",
      populate: { path: "author", select: "username" },
    });

    if (!post) {
      res.send({ success: false, message: "Post not found" });
      return;
    }

    res.send({ success: true, data: post.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:commentId", authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.send({ success: false, message: "Comment not found" });
      return;
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      res.send({ success: false, message: "Not authorized" });
      return;
    }

    await comment.deleteOne();

    res.send({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

router.put("/:commentId", authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .send({ success: false, message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "Not authorized to edit this comment",
      });
    }

    comment.text = text;
    comment.edited = true;
    await comment.save();

    res.send({ success: true, data: comment });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

export default router;
