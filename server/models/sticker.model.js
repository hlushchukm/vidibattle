const { default: mongoose } = require("mongoose");
const { stickerSchema } = require("../schemas/sticker.schema");

module.exports.Sticker = mongoose.model("Sticker", stickerSchema);
