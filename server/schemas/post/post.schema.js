const mongoose = require("mongoose");
const { feed, timeline, like, unlike } = require("./post.method");

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
    comments_count: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false },
    competition: { type: Schema.Types.ObjectId, ref: "Competition" },
    round: { type: Number },
    sticker: { type: Schema.Types.ObjectId, ref: "Sticker" },
  },
  { timestamps: true }
);

// Methods
postSchema.statics.feed = feed; // feed generation
postSchema.statics.timeline = timeline; // timeline generation
postSchema.statics.like = like; // like a post
postSchema.statics.unlike = unlike; // unlike a post

module.exports.postSchema = postSchema;
