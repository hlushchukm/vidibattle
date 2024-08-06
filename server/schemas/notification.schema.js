const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = Schema(
  {
    to : { type: String, required: true, ref: "User" },
    title: { type: String, required: true },
    description: { type: String },
    read: { type: Boolean, default: false },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  { timestamps: true }
);

module.exports.notificationSchema = notificationSchema;
