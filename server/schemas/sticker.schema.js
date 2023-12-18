const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const stickerSchema = Schema(
  {
    image: { type: String, required: true },
    type: { type: String, enum: ["small", "full-line"], required: true },
    position: {
      type: String,
      enum: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "top",
        "bottom",
      ],
      required: true,
    },
    competition: { type: Schema.Types.ObjectId, ref: "Competition" },
    usage_limit: { type: Number, required: true },
    usage_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports.stickerSchema = stickerSchema;
