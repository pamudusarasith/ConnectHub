import express from "express";
import Post from "../models/Post.js";
import mongoose from "mongoose";
import Community from "../models/Community.js";
import { authenticate, maybeAuthenticate } from "../jwt.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let posts = await Post.find({})
    .populate({ path: "author", select: "firstName lastName username" })
    .sort({ createdAt: -1 });

  posts = posts.map((post) => post.toJSON());

  for (const post of posts) {
    post.isLiked = req.user?.likedPosts.includes(post._id) || false;
  }

  res.send({ success: true, data: posts });
});

router.get("/:id", maybeAuthenticate, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  // let post = await Post.findById(id).populate({
  //   path: "author",
  //   select: "firstName lastName username",
  // });

  let post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $project: {
        community: 1,
        title: 1,
        content: 1,
        author: 1,
        likesCount: { $size: "$likes" },
        createdAt: 1,
        updatedAt: 1,
        isLiked: {
          $in: [req.user?._id, "$likes"],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
        pipeline: [{ $project: { firstName: 1, lastName: 1, username: 1 } }],
      },
    },
  ]);

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }
  post = post[0]
  post.author = post.author[0];
  res.status(200).json(post);
});

router.post("/", authenticate, async (req, res) => {
  const { name, title, content } = req.body;
  const community = await Community.findOne({ name: name });

  try {
    const post = await Post.create({
      community: community._id,
      title,
      content,
      author: req.user._id,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  let post = await Post.findOne({ _id: id });

  if (!post) {
    return res.status(400).json({ error: "No such post" });
  }

  if (post.author !== req.user._id)
    return res.status(400).json({ error: "Unauthorized" });

  post = await Post.findOneAndDelete({ _id: id });

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

router.post("/:id/like", authenticate, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id });

  if (!post) {
    res.send({ success: false, message: "No such post" });
    return;
  }

  if (req.user.likedPosts.includes(post._id)) {
    req.user.likedPosts = req.user.likedPosts.filter(
      (id) => id.toString() !== post._id.toString()
    );
    await req.user.save();

    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await post.save();
    res.send({ success: true, message: "Unliked" });
  } else {
    req.user.likedPosts.push(post._id);
    await req.user.save();

    post.likes.push(req.user._id);
    await post.save();

    res.send({ success: true, message: "Liked" });
  }
});

export default router;
