const { default: mongoose } = require("mongoose");
const { messageSchema } = require("../schemas/chat/message.schema");

module.exports.Message = mongoose.model("Message", messageSchema);
