import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    // date: {
    //     type: Date,
    //     default: Date.now
    // }
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;