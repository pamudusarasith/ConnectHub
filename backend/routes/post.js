import express from "express";
import Post from "../models/Post.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort({ createAt: -1 });

  res.status(200).json(posts);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
});

router.post("/", async (req, res) => {
  const { threadId, content, authorId, createdAt, updatedAt } = req.body;

  try {
    const post = await Post.create({
      threadId,
      content,
      authorId,
      createdAt,
      updatedAt,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findOneAndDelete({ _id: id });

  if (!post) {
    return res.status(400).json({ error: "No such post" });
  }

  res.status(200).json(post);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!post) {
    return res.status(400).json({ error: "No such post" });
  }

  res.status(200).json(post);
});

export default router;
