import express from "express";
import Post from "../models/Post.js";
import mongoose from "mongoose";
import Community from "../models/Community.js";
import { authenticate, maybeAuthenticate } from "../jwt.js";

const router = express.Router();

router.get("/", maybeAuthenticate, async (req, res) => {
  let posts = await Post.aggregate([
    {
      $addFields: {
        likesCount: { $size: "$likes" },
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

  posts = posts.map((post) => {
    return {
      ...post,
      author: post.author[0],
      isLiked: req.user?.likedPosts.includes(post._id) || false,
    };
  });

  res.send({ success: true, data: posts });
});

router.get("/:id", maybeAuthenticate, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  let post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
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
  post = post[0];
  post.author = post.author[0];
  res.status(200).json(post);
});

router.get("/community/:name", maybeAuthenticate, async (req, res) => {
  const { name } = req.params;

  let community = await Community.find({name}).populate({
    path: "posts",
    populate: { path: "author", select: "firstName lastName username" },
  });

  if (!community) {
    return res.status(404).json({ error: "No such community" });
  }
  community = community[0]
  
  let posts = community.posts.map((p) => p.toJSON());
  posts = posts.map((post) => {
    return {
      ...post,
      isLiked: req.user?.likedPosts.includes(post._id) || false,
      isOwner: req.user?._id.toString() === post.author._id.toString() || false,
    };
  });
  res.status(200).json(posts);
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
    community.posts.push(post);
    await community.save();
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
