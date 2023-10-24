const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    // TODO: change type of file field
    file: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "sticker", "thumbnail"],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file_name: { type: String },
  },
  { timestamps: true }
);

module.exports.mediaSchema = mediaSchema;
