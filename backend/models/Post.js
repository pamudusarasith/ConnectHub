import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    threadId: {
      type: String,
      required: true,
    },
    title:{
      type:String,
      required: true,

    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
