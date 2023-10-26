const { default: mongoose } = require("mongoose");
const { chatSchema } = require("../schemas/chat/chat.schema");

module.exports.Chat = mongoose.model("Chat", chatSchema);
