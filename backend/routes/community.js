import express from "express";
import Community from "../models/Community.js";
import Tag from "../models/Tag.js";
import { authenticate, maybeAuthenticate } from "../jwt.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { name, description, tags } = req.body;

    const insertedTags = await Tag.insertMany(
      tags.map((tn) => {
        return { name: tn };
      })
    );

    const community = new Community({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
      tags: insertedTags.map((tag) => tag._id),
    });

    await community.save();

    req.user.joinedCommunities.push(community._id);
    await req.user.save();

    res.send({ success: true, data: community });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.send({
        success: false,
        message: Object.values(error.errors)[0].message,
      });
    } else {
      res.send({ success: false, message: error.message });
    }
  }
});

router.get("/", maybeAuthenticate, async (req, res) => {
  const communities = await Community.aggregate([
    {
      $project: {
        name: 1,
        description: 1,
        tags: 1,
        membersCount: { $size: "$members" },
        isMember: { $in: [req.user?._id, "$members"] },
      },
    },
  ]);

  res.send({ success: true, data: communities });
});

router.get("/joined", authenticate, async (req, res) => {
  const user = await req.user.populate({
    path: "joinedCommunities",
    select: "_id name",
  });

  res.send({ success: true, data: user.joinedCommunities });
});

router.get("/:name", maybeAuthenticate, async (req, res) => {
  const { name } = req.params;
  const community = await Community.aggregate([
    {
      $match: { name: name },
    },
    {
      $project: {
        name: 1,
        description: 1,
        tags: 1,
        membersCount: { $size: "$members" },
        isMember: { $in: [req.user?._id, "$members"] },
        isOwner: { $eq: ["$owner", req.user?._id] },
      },
    },
  ]);

  if (community.length === 0) {
    res.send({ success: false, message: "No such community" });
    return;
  }

  res.send({ success: true, data: community[0] });
});

router.put("/:name", authenticate, async (req, res) => {
  const { name } = req.params;
  const community = await Community.findOne({ name: name });

  if (!community) {
    res.send({ success: false, message: "No such community" });
    return;
  }

  if (req.user._id.toString() !== community.owner.toString()) {
    res.send({ success: false, message: "Not authorized" });
    return;
  }

  community.name = req.body.name;
  community.description = req.body.description;
  community.tags = req.body.tags;

  await community.save();

  res.send({ success: true, data: community });
});

router.delete("/:name", authenticate, async (req, res) => {
  const { name } = req.params;
  const community = await Community.findOne({ name: name });

  if (!community) {
    res.send({ success: false, message: "No such community" });
    return;
  }

  if (req.user._id.toString() !== community.owner.toString()) {
    res.send({ success: false, message: "Not authorized" });
    return;
  }

  await Community.deleteOne({ _id: community._id });

  res.send({ success: true });
});

router.post("/:name/join", authenticate, async (req, res) => {
  const { name } = req.params;
  const community = await Community.findOne({ name: name });

  if (!community) {
    res.send({ success: false, message: "No such community" });
    return;
  }

  if (req.user.joinedCommunities.includes(community._id)) {
    res.send({ success: false, message: "Already a member" });
    return;
  }

  req.user.joinedCommunities.push(community._id);
  await req.user.save();

  community.members.push(req.user._id);
  await community.save();

  res.send({ success: true });
});

router.post("/:name/leave", authenticate, async (req, res) => {
  const { name } = req.params;
  const community = await Community.findOne({ name: name });

  if (!community) {
    res.send({ success: false, message: "No such community" });
    return;
  }

  if (!req.user.joinedCommunities.includes(community._id)) {
    res.send({ success: false, message: "Not a member" });
    return;
  }

  req.user.joinedCommunities = req.user.joinedCommunities.filter(
    (id) => id.toString() !== community._id.toString()
  );
  await req.user.save();

  community.members = community.members.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await community.save();

  res.send({ success: true });
});

export default router;
