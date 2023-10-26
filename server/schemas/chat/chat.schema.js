const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

module.exports.chatSchema = chatSchema;
