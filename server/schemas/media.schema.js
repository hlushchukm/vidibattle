const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "sticker", "thumbnail"],
      required: true,
    },
    thumbnail: [{ type: Schema.Types.ObjectId, ref: "media" }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports.mediaSchema = mediaSchema;
