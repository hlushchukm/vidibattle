const { default: mongoose } = require("mongoose");
const { like, unlike, getComments } = require("./comment.method");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    comment_for: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    parent_post: { type: Schema.Types.ObjectId, ref: "Post" },
    parent_comment: { type: Schema.Types.ObjectId, ref: "Comment" }, // a field with parent_comment 'null' and type 'post'
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    reply_for: { type: Schema.Types.ObjectId, ref: "User" }, // if the comment is a reply for a comment, the user who made the original comment
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes_count: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// methods
commentSchema.statics.like = like; // like a comment
commentSchema.statics.unlike = unlike; // unlike a comment
commentSchema.statics.getComments = getComments; //get comments

module.exports.commentSchema = commentSchema;
