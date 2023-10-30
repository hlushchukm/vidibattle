const { default: mongoose } = require("mongoose");
const { like, unlike } = require("./comment.method");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    comment_for: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    comment_for: { type: Schema.Types.ObjectId, ref: "User" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes_count: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// methods
commentSchema.statics.like = like; // like a comment
commentSchema.statics.unlike = unlike; // unlike a comment

module.exports.commentSchema = commentSchema;
