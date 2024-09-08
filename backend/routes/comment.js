import express from "express";
import Comment from "../models/Comment.js";
import Community from "../models/Community.js";
import { authenticate } from "../jwt.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    console.log('Received request to create comment:', req.body);
    try {
        const { text } = req.body;
        const comment = new Comment({
            text,
            author: req.user._id
        });

        await comment.save();

        await comment.populate("author", "username");

        res.send({ success: true, data: comment });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find().populate("author", "username");
        res.send({ success: true, data: comments });
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
            return res.status(404).send({ success: false, message: "Comment not found" });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).send({ success: false, message: "Not authorized to edit this comment" });
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
