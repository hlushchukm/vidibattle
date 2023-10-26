const mongoose = require("mongoose");
const { feed, timeline } = require("./post.method");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: { type: String },
    media: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    likes_count: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hidden: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Methods
postSchema.statics.feed = feed; // feed generation
postSchema.statics.timeline = timeline; // timeline generation

module.exports.postSchema = postSchema;