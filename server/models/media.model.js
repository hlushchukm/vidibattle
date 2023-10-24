const mongoose = require("mongoose");
const { mediaSchema } = require("../schemas/media.schema");

module.exports.Media = mongoose.model("Media", mediaSchema);
