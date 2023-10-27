const { default: mongoose } = require("mongoose");
const { chatList } = require("./message.method");

const Schema = mongoose.Schema;

const messageSchema = Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seen: { type: Boolean, default: false },
    content: { type: String, required: true },
    chat_id: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  },
  { timestamps: true }
);

// Methods
messageSchema.statics.chatList = chatList;

module.exports.messageSchema = messageSchema;
